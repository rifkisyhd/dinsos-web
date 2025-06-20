"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2"; // Tambahkan import ini

import LoadingScreen from "../components/LoadingScreen";
import Pagination from "../components/Pagination";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import ExportExcel from "../components/ExportExcel";

export default function AdminPanel() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [availableYears, setAvailableYears] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [petugasList, setPetugasList] = useState([]);
    const [selectedPetugas, setSelectedPetugas] = useState("");
    const [selectedKabupaten, setSelectedKabupaten] = useState("");
    const [kabupatenList, setKabupatenList] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 20;
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / perPage);
    const [searchInput, setSearchInput] = useState("");
    const [filteredAllData, setFilteredAllData] = useState([]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push("/login");
            } else {
                setIsAuthenticated(true); // tandain kalo udah login
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [
        isAuthenticated,
        page,
        searchKeyword,
        selectedMonth,
        selectedYear,
        selectedPetugas,
        selectedKabupaten,
    ]);

    useEffect(() => {
        if (searchInput === "") {
            setSearchKeyword("");
            setPage(1); // reset ke halaman 1 juga biar aman
        }
    }, [searchInput]);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Hitung offset
            const from = (page - 1) * perPage;
            const to = from + perPage - 1;

            // ==== 1. Ambil total count & data paginasi (dengan filter) ====
            let query = supabase
                .from("tb_input")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false });

            // === APPLY FILTER ===
            if (searchKeyword) {
                query = query.or(
                    `nama_lengkap.ilike.%${searchKeyword}%,nik.ilike.%${searchKeyword}%`,
                );
            }

            // Filter tahun & bulan pakai range tanggal
            if (selectedYear && selectedMonth) {
                const start = `${selectedYear}-${selectedMonth.padStart(
                    2,
                    "0",
                )}-01`;
                const endDate = new Date(
                    selectedYear,
                    Number(selectedMonth),
                    0,
                ).getDate();
                const end = `${selectedYear}-${selectedMonth.padStart(
                    2,
                    "0",
                )}-${endDate}`;
                query = query.gte("created_at", start).lte("created_at", end);
            } else if (selectedYear) {
                const start = `${selectedYear}-01-01`;
                const end = `${selectedYear}-12-31`;
                query = query.gte("created_at", start).lte("created_at", end);
            }

            if (selectedPetugas) {
                query = query.eq("petugas", selectedPetugas);
            }
            if (selectedKabupaten) {
                query = query.eq("kabupaten", selectedKabupaten);
            }

            // Hitung total count dulu
            const countResult = await query;
            if (countResult.error) throw countResult.error;

            const count = countResult.count || 0;
            setTotalCount(count);

            // Cek batas halaman
            const maxPage = Math.max(1, Math.ceil(count / perPage));
            if (page > maxPage) {
                setPage(1);
                return;
            }

            // Ambil data paginasi
            const { data: filteredData, error: dataError } = await query.range(
                from,
                to,
            );
            if (dataError) throw dataError;
            setData(filteredData);

            // Ambil semua data hasil filter (tanpa paginasi)
            let allFilteredQuery = supabase
                .from("tb_input")
                .select("*")
                .order("created_at", { ascending: false });

            if (searchKeyword) {
                allFilteredQuery = allFilteredQuery.or(
                    `nama_lengkap.ilike.%${searchKeyword}%,nik.ilike.%${searchKeyword}%`,
                );
            }
            if (selectedYear && selectedMonth) {
                const start = `${selectedYear}-${selectedMonth.padStart(
                    2,
                    "0",
                )}-01`;
                const endDate = new Date(
                    selectedYear,
                    Number(selectedMonth),
                    0,
                ).getDate();
                const end = `${selectedYear}-${selectedMonth.padStart(
                    2,
                    "0",
                )}-${endDate}`;
                allFilteredQuery = allFilteredQuery
                    .gte("created_at", start)
                    .lte("created_at", end);
            } else if (selectedYear) {
                const start = `${selectedYear}-01-01`;
                const end = `${selectedYear}-12-31`;
                allFilteredQuery = allFilteredQuery
                    .gte("created_at", start)
                    .lte("created_at", end);
            }
            if (selectedPetugas) {
                allFilteredQuery = allFilteredQuery.eq(
                    "petugas",
                    selectedPetugas,
                );
            }
            if (selectedKabupaten) {
                allFilteredQuery = allFilteredQuery.eq(
                    "kabupaten",
                    selectedKabupaten,
                );
            }

            const { data: allFiltered, error: allFilteredError } =
                await allFilteredQuery;
            if (allFilteredError) throw allFilteredError;
            setFilteredAllData(allFiltered);

            // ==== 2. Ambil data filter (sekali aja, tidak dipengaruhi paginasi) ====
            const { data: allData, error: allError } = await supabase
                .from("tb_input")
                .select("created_at, petugas, kabupaten");
            if (allError) throw allError;

            // Ambil tahun
            const years = [
                ...new Set(
                    allData.map((item) =>
                        new Date(item.created_at).getFullYear(),
                    ),
                ),
            ];
            setAvailableYears(years.sort((a, b) => b - a));

            // Bulan
            const months = [
                ...new Set(
                    allData.map((item) =>
                        new Date(item.created_at).toISOString().slice(5, 7),
                    ),
                ),
            ];
            setAvailableMonths(months.sort());

            // Petugas & kabupaten
            setPetugasList([...new Set(allData.map((item) => item.petugas))]);
            setKabupatenList([
                ...new Set(allData.map((item) => item.kabupaten)),
            ]);
        } catch (error) {
            console.error("Gagal ambil data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // Tambahkan fungsi reset filter
    const handleResetFilter = () => {
        setSelectedYear("");
        setSelectedMonth("");
        setSelectedPetugas("");
        setSelectedKabupaten("");
        setSearchKeyword("");
        setSearchInput("");
        setPage(1);
    };

    async function handleMerge() {
        try {
            // Ambil URL PDF dari filteredAllData (data yang sudah difilter)
            const pdfUrls = filteredAllData
                .filter((item) => item.hasil_pdf) // Pastikan URL tidak kosong
                .map((item) => item.hasil_pdf);

            if (pdfUrls.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Tidak ada PDF",
                    text: "Tidak ada file PDF yang dapat digabungkan dari data terpilih.",
                });
                return;
            }

            // Tampilkan indikator loading
            Swal.fire({
                title: "Sedang memproses...",
                html: `Menggabungkan ${pdfUrls.length} file PDF`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Tampilkan info jumlah file
            console.log(`Menggabungkan ${pdfUrls.length} file PDF...`);

            const resp = await fetch("/api/pdf-merge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdfUrls }),
            });

            // Tutup loading dialog
            Swal.close();

            if (resp.ok) {
                // Siapkan nama file default
                const defaultFileName = `gabungan_${selectedYear || "semua"}_${
                    selectedMonth || "semua"
                }`;

                // Gunakan SweetAlert2 untuk input nama file
                const { value: fileName, isDismissed } = await Swal.fire({
                    title: "Masukkan nama file",
                    input: "text",
                    inputLabel: "Nama file PDF hasil gabungan:",
                    inputValue: defaultFileName,
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value && !defaultFileName) {
                            return "Nama file tidak boleh kosong!";
                        }
                    },
                    cancelButtonText: "Batal",
                    confirmButtonText: "Download",
                });

                // Cek jika user cancel
                if (isDismissed || fileName === undefined) {
                    return;
                }

                // Gunakan nama dari user atau default jika kosong
                const finalFileName = (fileName || defaultFileName).trim();

                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${finalFileName}.pdf`; // Tambahkan ekstensi .pdf
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                // Tampilkan pesan sukses
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "File PDF berhasil diunduh.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                // Handle error
                const errorText = await resp.text();
                throw new Error(errorText);
            }
        } catch (error) {
            console.error("Gagal menggabungkan PDF:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal menggabungkan PDF: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    // --- MULAI PERUBAHAN TATA LETAK DI SINI ---
    return (
        <div className="min-h-screen w-full px-4 sm:px-6 py-10 bg-gray-50">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Panel Admin
                    </h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors duration-200">
                            Logout
                        </button>

                        {/* Tombol Merge PDF */}
                        <button
                            onClick={handleMerge}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Gabung PDF
                        </button>

                        <ExportExcel
                            data={filteredAllData}
                            filterMonth={selectedMonth}
                            fileName="data_admin.xlsx"
                        />
                    </div>
                </div>

                {/* Kotak Filter */}
                <div className="flex items-center mb-4 gap-2">
                    <FilterBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setSearchKeyword={setSearchKeyword}
                        setPage={setPage}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        availableYears={availableYears}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        availableMonths={availableMonths}
                        selectedKabupaten={selectedKabupaten}
                        setSelectedKabupaten={setSelectedKabupaten}
                        kabupatenList={kabupatenList}
                        selectedPetugas={selectedPetugas}
                        setSelectedPetugas={setSelectedPetugas}
                        petugasList={petugasList}
                        onResetFilter={handleResetFilter}
                    />
                </div>

                {/* Tabel Data */}
                <DataTable
                    data={data}
                    page={page}
                    perPage={perPage}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedPetugas={selectedPetugas}
                    selectedKabupaten={selectedKabupaten}
                    searchKeyword={searchKeyword}
                    router={router}
                    fetchData={fetchData}
                />

                {/* Pagination */}
                <Pagination
                    page={page}
                    totalPages={Math.max(1, Math.ceil(totalCount / perPage))}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
