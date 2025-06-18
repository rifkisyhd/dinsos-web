"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
            if (selectedYear) {
                query = query.filter(
                    "extract(year from created_at)",
                    "eq",
                    selectedYear,
                );
            }
            if (selectedMonth) {
                const formattedMonth = selectedMonth
                    .toString()
                    .padStart(2, "0");
                query = query.filter(
                    "to_char(created_at, 'MM')",
                    "eq",
                    formattedMonth,
                );
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
            if (selectedYear) {
                allFilteredQuery = allFilteredQuery.filter(
                    "extract(year from created_at)",
                    "eq",
                    selectedYear,
                );
            }
            if (selectedMonth) {
                const formattedMonth = selectedMonth
                    .toString()
                    .padStart(2, "0");
                allFilteredQuery = allFilteredQuery.filter(
                    "to_char(created_at, 'MM')",
                    "eq",
                    formattedMonth,
                );
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

    if (isLoading) {
        return <LoadingScreen />;
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
                            data={filteredAllData}
                            filterMonth={selectedMonth}
                            fileName="data_admin.xlsx"
                        />
                    </div>
                </div>

                {/* Kotak Filter */}
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
                />

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
