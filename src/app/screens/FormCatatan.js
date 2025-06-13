// src/screens/FormCatatan.js

"use client";

import { useState } from "react";
import Button from "../components/Button"; // Pastikan path ini sesuai dengan struktur proyek Anda

export default function FormCatatan({ setStep, submitAllData }) {
    const [catatan, setCatatan] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitAllData({ catatan: catatan });
        } finally {
            setIsSubmitting(false);
        }
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
                Blok 9 - Catatan Petugas Asesmen
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
            </label>
            <textarea
                name="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 transition-colors duration-200"
                placeholder="Jelaskan kondisi ekonomi, aset, dll..."
                rows="6"
            />
            <p className="text-xs text-gray-500 mb-6">
                Jelaskan kondisi ekonomi, aset (seperti rumah, kendaraan, dan
                lain-lain), serta alasan mengapa yang bersangkutan layak untuk
                mendapatkan Program Sekolah Rakyat
            </p>

            {/* --- BAGIAN YANG DIPERBARUI --- */}
            <div className="flex justify-end gap-4 mt-6">
                <Button
                    label="Sebelumnya"
                    variant="secondary"
                    onClick={() => setStep(8)}
                    disabled={isSubmitting}
                />
                <Button
                    label={
                        isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Mengirim...
                            </div>
                        ) : (
                            "Kirim"
                        )
                    }
                    type="submit"
                    variant="success"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
}   