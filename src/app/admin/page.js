"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import Pagination from "../components/Pagination";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
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
    const totalPages = Math.ceil(totalCount / perPage);
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
                <FilterBar
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
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
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
