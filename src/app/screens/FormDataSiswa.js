"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Button from "../components/Button";
import TitleForm from "../components/TitleForm";

// Sebaiknya client ini dipindah ke file terpisah (misal: src/lib/supabaseClient.js)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function FormDataSiswa({ setStep }) {
    const [form, setForm] = useState({
        namaLengkap: "",
        nik: "",
        nomorKK: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        agama: "",
    });

    const [agamaList, setAgamaList] = useState([]);
    const [loadingAgama, setLoadingAgama] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const fetchAgama = async () => {
            try {
                const { data, error } = await supabase
                    .from("agama")
                    .select("*");
                if (error) throw error;
                setAgamaList(data);
            } catch (error) {
                console.error("Error fetching agama:", error.message);
            } finally {
                setLoadingAgama(false); // Set loading ke false setelah selesai
            }
        };

        fetchAgama();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <TitleForm blok=" Blok 2 - Data Diri Calon Siswa" />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
            </label>
            <input
                name="namaLengkap"
                value={form.namaLengkap}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan nama lengkap"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
            </label>
            <input
                name="nik"
                type="number"
                value={form.nik}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan 16 digit NIK"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor KK
            </label>
            <input
                name="nomorKK"
                type="number"
                value={form.nomorKK}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan 16 digit Nomor KK"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
            </label>
            <input
                name="tempatLahir"
                value={form.tempatLahir}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan Tempat Lahir"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
            </label>
            <input
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
                type="date"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
            </label>
            <select
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Agama
            </label>
            <select
                name="agama"
                value={form.agama}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200">
                {loadingAgama ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        <option value="">Pilih Agama</option>
                        {agamaList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}
                    </>
                )}
            </select>

<div className="flex justify-beetween mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(1)} />
                <Button label="Selanjutnya" onClick={() => setStep(3)} />
            </div>
        </form>
    );
}
