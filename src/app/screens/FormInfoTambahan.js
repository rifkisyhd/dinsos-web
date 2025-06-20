"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../components/Button";
import { supabase } from "@/lib/supabaseClient"; // Menggunakan client terpusat
import {
    requiredFields,
    validateFormWithAlert,
} from "../components/formValidation";

export default function FormInfoTambahan({ setStep }) {
    const [form, setForm] = useState({
        ukuranBaju: "",
        ukuranCelana: "",
        ukuranSepatu: "",
    });

    const [bajuOptions, setBajuOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fungsi untuk mengambil data ukuran baju dari Supabase
        const fetchUkuranBaju = async () => {
            setIsLoading(true);
            try {
                // Ganti "ukuran_baju" dengan nama tabel Anda yang sebenarnya jika berbeda
                const { data, error } = await supabase
                    .from("ukuran_baju")
                    .select("*");
                if (error) throw error;
                setBajuOptions(
                    data.map((item) => ({
                        value: item.ukuran,
                        label: item.ukuran,
                    })),
                );
            } catch (error) {
                console.error("Error fetching ukuran baju:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUkuranBaju();
    }, []);

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Fungsi ini akan dijalankan saat form disubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        // Di sini Anda bisa mengumpulkan semua data dari semua step dan mengirimkannya ke database
        console.log("Final form submission data:", form);
        alert("Pendaftaran Selesai!");
        // Mungkin redirect ke halaman terima kasih atau reset state
        // setStep(1);
    };

    return (
        <form
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT
            </h2>
            <p className="text-center text-gray-500 mb-8">
                TAHUN AJARAN 2025-2026
            </p>

            <p className="text-lg font-semibold text-blue-600 mb-6 border-b pb-2">
                Blok 7 - Informasi tambahan anak
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Ukuran Baju
            </label>
            <Select
                name="ukuranBaju"
                options={bajuOptions}
                value={bajuOptions.find(
                    (option) => option.value === form.ukuranBaju,
                )}
                onChange={(option) => handleChange("ukuranBaju", option.value)}
                isLoading={isLoading}
                placeholder={isLoading ? "Memuat..." : "Pilih Ukuran Baju"}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Ukuran Celana
            </label>
            <input
                name="ukuranCelana"
                value={form.ukuranCelana}
                onChange={(e) => handleChange("ukuranCelana", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Contoh: 28 atau M"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Sepatu Sekolah
            </label>
            <input
                name="ukuranSepatu"
                type="number"
                value={form.ukuranSepatu}
                onChange={(e) => handleChange("ukuranSepatu", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Contoh: 38"
            />

            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(6)} />
                <Button
                    label="Selanjutnya"
                    onClick={() => {
                        if (
                            !validateFormWithAlert(
                                form,
                                requiredFields.infoTambahan,
                                "Semua data info tambahan wajib diisi!",
                            )
                        ) {
                            return;
                        }
                        setStep(8);
                    }}
                />
            </div>
        </form>
    );
}
