"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import ExportExcel from "../components/ExportExcel";
import Swal from "sweetalert2";

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
    }, [isAuthenticated, page]);

    const fetchData = async () => {
        try {
            const from = (page - 1) * perPage;

            // Ambil semua data (buat filter & export)
            const { data: allData, error: allDataError } = await supabase
                .from("tb_input")
                .select("*");

            if (allDataError) throw allDataError;

            // Hitung total row
            setTotalCount(allData.length); // Simpan total ke state

            // Data paginasi
            const { data: paginatedData, error: rangeError } = await supabase
                .from("tb_input")
                .select("*")
                .order("created_at", { ascending: false })
                .range(from, from + perPage - 1);

            if (rangeError) throw rangeError;

            // Tahun
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

            // Petugas
            const uniquePetugas = [
                ...new Set(allData.map((item) => item.petugas)),
            ];
            setPetugasList(uniquePetugas);

            // Kabupaten
            const uniqueKabupaten = [
                ...new Set(allData.map((item) => item.kabupaten)),
            ];
            setKabupatenList(uniqueKabupaten);

            // Set data yang dipake untuk tampilan
            setData(paginatedData);
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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin mau hapus?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            await supabase.from("tb_input").delete().eq("id", id);
            await fetchData(); // Refresh data

            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // --- MULAI PERUBAHAN TATA LETAK DI SINI ---
    return (
        <div className="min-h-screen w-full px-4 sm:px-6 py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto">
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
                        <ExportExcel
                            data={data}
                            filterMonth={selectedMonth}
                            fileName="data_admin.xlsx"
                        />
                    </div>
                </div>

                {/* Kotak Filter */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Search (dibuat lebih panjang) */}
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="search"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Cari Nama atau NIK
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Ketik di sini..."
                                value={searchKeyword}
                                onChange={(e) =>
                                    setSearchKeyword(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Filter Tahun */}
                        <div>
                            <label
                                htmlFor="filter-tahun"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Tahun
                            </label>
                            <select
                                id="filter-tahun"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Semua</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Bulan */}
                        <div>
                            <label
                                htmlFor="filter-bulan"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Bulan
                            </label>
                            <select
                                id="filter-bulan"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Semua</option>
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(
                                            `2023-${month}-01`,
                                        ).toLocaleDateString("id-ID", {
                                            month: "long",
                                        })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Kabupaten */}
                        <div>
                            <label
                                htmlFor="filter-kabupaten"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Kabupaten
                            </label>
                            <select
                                id="filter-kabupaten"
                                value={selectedKabupaten}
                                onChange={(e) =>
                                    setSelectedKabupaten(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Semua</option>
                                {kabupatenList.map((nama, idx) => (
                                    <option key={idx} value={nama}>
                                        {nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Petugas */}
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="filter-petugas"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Petugas
                            </label>
                            <select
                                id="filter-petugas"
                                value={selectedPetugas}
                                onChange={(e) =>
                                    setSelectedPetugas(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Semua</option>
                                {petugasList.map((nama, idx) => (
                                    <option key={idx} value={nama}>
                                        {nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">NIK</th>
                                <th className="px-6 py-3">No. KK</th>
                                <th className="px-6 py-3">Alamat</th>
                                <th className="px-6 py-3">Kabupaten</th>
                                <th className="px-6 py-3">Petugas</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-10">
                                        Tidak ada data yang cocok dengan filter.
                                    </td>
                                </tr>
                            ) : (
                                data
                                    .filter((item) => {
                                        // Logika filter tidak diubah
                                        const date = new Date(item.created_at);
                                        const itemMonth = date
                                            .toISOString()
                                            .slice(5, 7);
                                        const itemYear = date
                                            .getFullYear()
                                            .toString();
                                        const matchMonth = selectedMonth
                                            ? itemMonth === selectedMonth
                                            : true;
                                        const matchYear = selectedYear
                                            ? itemYear === selectedYear
                                            : true;
                                        const keyword =
                                            searchKeyword.toLowerCase();
                                        const matchKeyword =
                                            item.nama_lengkap
                                                ?.toLowerCase()
                                                .includes(keyword) ||
                                            item.nik
                                                ?.toLowerCase()
                                                .includes(keyword);
                                        const petugasMatch = selectedPetugas
                                            ? item.petugas === selectedPetugas
                                            : true;
                                        const kabupatenMatch = selectedKabupaten
                                            ? item.kabupaten ===
                                              selectedKabupaten
                                            : true;
                                        return (
                                            matchMonth &&
                                            matchYear &&
                                            (searchKeyword
                                                ? matchKeyword
                                                : true) &&
                                            petugasMatch &&
                                            kabupatenMatch
                                        );
                                    })
                                    .map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="px-6 py-4">
                                                {(page - 1) * perPage +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {item.nama_lengkap}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.nik}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.nomor_kk}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.alamat}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.kabupaten}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.petugas}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/detail/${item.id}`,
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
                                                        Detail
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                        Sebelumnya
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Halaman {page}
                    </span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page * perPage >= totalCount}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Berikutnya
                    </button>
                </div>
            </div>
        </div>
    );
}
