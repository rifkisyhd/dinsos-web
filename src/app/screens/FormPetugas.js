"use client";

import { useState, useEffect } from "react";
// import Select from "react-select"; // <-- Hapus atau beri komentar baris ini
import dynamic from 'next/dynamic'; // <-- Import dynamic

import Button from "../components/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// --- PERUBAHAN DI SINI ---
// Gunakan dynamic import untuk memuat komponen Select hanya di client side
const Select = dynamic(() => import('react-select'), {
    ssr: false, // Nonaktifkan Server-Side Rendering untuk komponen ini
    loading: () => <div className="w-full bg-gray-200 border border-gray-300 h-[42px] rounded-lg block p-2.5 mb-4 animate-pulse"></div>
});

export default function FormPetugas({ setStep }) {
    // ... sisa kode Anda tidak perlu diubah sama sekali ...
    // ... (useState, useEffect, handleChange, handleSubmit, return, dll. tetap sama) ...
    const [form, setForm] = useState({
        petugas: "",
        namaPetugas: "",
        nomorHpPetugas: "",
        lokasi: "",
    });
    const [pernyataanBenar, setPernyataanBenar] = useState(false);

    const [petugasOptions, setPetugasOptions] = useState([]);
    const [lokasiOptions, setLokasiOptions] = useState([]);
    const [isLoading, setIsLoading] = useState({ petugas: true, lokasi: true });

    useEffect(() => {
        const fetchData = async (tableName, setOptions, loadingKey) => {
            setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
            try {
                const { data, error } = await supabase.from(tableName).select("*");
                if (error) throw error;
                setOptions(data.map((item) => ({ value: item.nama, label: item.nama })));
            } catch (error) {
                console.error(`Error fetching ${tableName}:`, error.message);
            } finally {
                setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
            }
        };

        fetchData("daftar_petugas", setPetugasOptions, "petugas");
        fetchData("lokasi_sekolah", setLokasiOptions, "lokasi");
    }, []);

    const handleChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pernyataanBenar) {
            alert("Anda harus menyetujui pernyataan untuk melanjutkan.");
            return;
        }
        console.log("Data Petugas:", form);
        setStep(2); 
    }

    return (
        <form 
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            onSubmit={handleSubmit}
        >
            {/* ... isi form Anda ... */}
             <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
                PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT
            </h2>
            <p className="text-center text-gray-500 mb-8">TAHUN AJARAN 2025-2026</p>

            <p className="text-lg font-semibold text-green-600 mb-6 border-b pb-2">
                Blok 1 - Petugas Asesmen Calon Siswa
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Petugas</label>
            <Select
                name="petugas"
                options={petugasOptions}
                isLoading={isLoading.petugas}
                placeholder={isLoading.petugas ? "Memuat..." : "Pilih Petugas"}
                onChange={(option) => handleChange("petugas", option.value)}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Petugas</label>
            <input name="namaPetugas" onChange={(e) => handleChange("namaPetugas", e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"/>

            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP Petugas</label>
            <input name="nomorHpPetugas" type="tel" onChange={(e) => handleChange("nomorHpPetugas", e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4" placeholder="Contoh: 08123456789"/>

            <label className="block text-sm font-medium text-gray-700 mb-1">Titik Lokasi Sekolah Rakyat</label>
            <Select
                name="lokasi"
                options={lokasiOptions}
                isLoading={isLoading.lokasi}
                placeholder={isLoading.lokasi ? "Memuat..." : "Pilih Lokasi"}
                onChange={(option) => handleChange("lokasi", option.value)}
                className="mb-4"
            />

            <div className="mt-6 mb-4">
                <div className="flex items-start">
                    <input
                        id="pernyataan"
                        type="checkbox"
                        checked={pernyataanBenar}
                        onChange={(e) => setPernyataanBenar(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="pernyataan" className="ml-3 text-sm text-gray-600">
                        Saya menyatakan bahwa data yang diisi sudah benar dan lengkap.
                    </label>
                </div>
                <div className="ml-7 mt-2 text-sm">
                    <Link href="/syarat" className="text-blue-600 hover:underline">Lihat Syarat Pernyataan</Link>
                    <span className="mx-2">|</span>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard Pendaftar</Link>
                </div>
                <p className="ml-7 mt-2 text-sm text-red-600">Rekomendasi: Gunakan Browser Mozilla</p>
            </div>

            <div className="flex justify-end mt-6">
                <Button label="Selanjutnya" type="submit" disabled={!pernyataanBenar} />
            </div>
        </form>
    );
}