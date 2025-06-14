"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ExportExcel from "../components/ExportExcel";

export default function AdminPanel() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            console.log("Session di /admin:", data.session);

            if (!data.session) {
                router.push("/login");
                return;
            }

            fetchData(); // kalau session OK
        };

        checkAuth();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from("tb_input")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setData(data);
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
        await supabase.from("tb_input").delete().eq("id", id);
        fetchData(); // refresh
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

                {/* Filter Bulan */}
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Filter Bulan:</label>
                    <select
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
                                        if (!selectedMonth) return true;
                                        const itemMonth = new Date(
                                            item.created_at,
                                        )
                                            .toISOString()
                                            .slice(5, 7);
                                        return itemMonth === selectedMonth;
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
                </div>
            </div>
        </div>
    );
}
