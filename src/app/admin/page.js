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
            const to = from + perPage - 1;

            const { data, error, count } = await supabase
                .from("tb_input")
                .select("*", { count: "exact" }) // dapetin total count juga
                .range(from, to)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setData(data);

            // Ambil tahun
            const years = [
                ...new Set(
                    data.map((item) => new Date(item.created_at).getFullYear()),
                ),
            ];
            setAvailableYears(years.sort((a, b) => b - a));

            // Ambil bulan
            const months = [
                ...new Set(
                    data.map((item) => {
                        const date = new Date(item.created_at);
                        return date.toISOString().slice(5, 7); // "01", "02", ...
                    }),
                ),
            ];
            setAvailableMonths(months.sort()); // urut dari Jan ke Des

            // Ambil nama petugas unik
            const uniquePetugas = [
                ...new Set(data.map((item) => item.petugas)),
            ];
            setPetugasList(uniquePetugas);

            // Ambil nama kabupaten unik
            const uniqueKabupaten = [
                ...new Set(data.map((item) => item.kabupaten)),
            ];
            setKabupatenList(uniqueKabupaten);
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

    return (
        <div className="min-h-screen w-full px-6 py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Panel Admin</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
                            Logout
                        </button>
                        <ExportExcel
                            data={data}
                            filterMonth={selectedMonth}
                            fileName="data_admin.xlsx"
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Cari:</label>
                    <input
                        type="text"
                        placeholder="Cari nama atau NIK..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="border px-3 py-1 rounded w-64"
                    />
                </div>

                {/* Filter Bulan */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Filter Bulan:</label>
                    {/* <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border px-3 py-1 rounded">
                        <option value="">Semua</option>
                        <option value="01">Januari</option>
                        <option value="02">Februari</option>
                        <option value="03">Maret</option>
                        <option value="04">April</option>
                        <option value="05">Mei</option>
                        <option value="06">Juni</option>
                        <option value="07">Juli</option>
                        <option value="08">Agustus</option>
                        <option value="09">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                    </select> */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border px-3 py-1 rounded">
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
                {/* Filter Tahun */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Filter Tahun:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border px-3 py-1 rounded">
                        <option value="">Semua</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Filter Kabupaten */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">
                        Filter Kabupaten:
                    </label>
                    <select
                        value={selectedKabupaten}
                        onChange={(e) => setSelectedKabupaten(e.target.value)}
                        className="border px-3 py-1 rounded">
                        <option value="">Semua</option>
                        {kabupatenList.map((nama, idx) => (
                            <option key={idx} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter Petugas */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">
                        Filter Petugas:
                    </label>
                    <select
                        value={selectedPetugas}
                        onChange={(e) => setSelectedPetugas(e.target.value)}
                        className="border px-3 py-1 rounded">
                        <option value="">Semua</option>
                        {petugasList.map((nama, idx) => (
                            <option key={idx} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 text-sm text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase">
                                <th className="px-4 py-2 border">Tanggal</th>
                                <th className="px-4 py-2 border">Nama</th>
                                <th className="px-4 py-2 border">NIK</th>
                                <th className="px-4 py-2 border">No. KK</th>
                                <th className="px-4 py-2 border">Alamat</th>
                                <th className="px-4 py-2 border">Kabupaten</th>
                                <th className="px-4 py-2 border">Petugas</th>
                                <th className="px-4 py-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-4">
                                        Tidak ada data.
                                    </td>
                                </tr>
                            ) : (
                                data
                                    .filter((item) => {
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

                                    .map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.nama_lengkap}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.nik}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.nomor_kk}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.alamat}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.kabupaten}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.petugas}
                                            </td>

                                            <td className="px-4 py-2 border">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/detail/${item.id}`,
                                                        )
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
                            Prev
                        </button>
                        <span>Halaman {page}</span>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
