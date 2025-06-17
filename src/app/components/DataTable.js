"use client";
import React from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

export default function DataTable({
    data,
    page,
    perPage,
    selectedMonth,
    selectedYear,
    selectedPetugas,
    selectedKabupaten,
    searchKeyword,
    router,
    fetchData,
}) {
    const filteredData = data.filter((item) => {
        const date = new Date(item.created_at);
        const itemMonth = date.toISOString().slice(5, 7);
        const itemYear = date.getFullYear().toString();

        const matchMonth = selectedMonth ? itemMonth === selectedMonth : true;
        const matchYear = selectedYear ? itemYear === selectedYear : true;

        const keyword = searchKeyword.toLowerCase();
        const matchKeyword =
            item.nama_lengkap?.toLowerCase().includes(keyword) ||
            item.nik?.toLowerCase().includes(keyword);

        const petugasMatch = selectedPetugas
            ? item.petugas === selectedPetugas
            : true;

        const kabupatenMatch = selectedKabupaten
            ? item.kabupaten === selectedKabupaten
            : true;

        return (
            matchMonth &&
            matchYear &&
            (searchKeyword ? matchKeyword : true) &&
            petugasMatch &&
            kabupatenMatch
        );
    });

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
            await fetchData(); // ambil ulang data dari AdminPanel
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        }
    };

        return (
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
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-10">
                                    Tidak ada data yang cocok dengan filter.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-6 py-4">
                                        {(page - 1) * perPage + index + 1}
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
                                    <td className="px-6 py-4">{item.nik}</td>
                                    <td className="px-6 py-4">
                                        {item.nomor_kk}
                                    </td>
                                    <td className="px-6 py-4">{item.alamat}</td>
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
                                                    handleDelete(item.id)
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
        );
    };

