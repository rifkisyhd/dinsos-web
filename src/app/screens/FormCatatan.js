// src/screens/FormCatatan.js

"use client";

import { useState } from "react";
import Button from "../components/Button";

export default function FormCatatan({ setStep, submitAllData }) {
    const [catatan, setCatatan] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Panggil fungsi submit utama dari page.js, dengan membawa data terakhir
        submitAllData({ catatan: catatan }); 
    }

    return (
        <form 
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT
            </h2>
            <p className="text-center text-gray-500 mb-8">TAHUN AJARAN 2025-2026</p>

            <p className="text-lg font-semibold text-blue-600 mb-6 border-b pb-2">
                Blok 9 - Catatan Petugas Asesmen
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
                name="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 transition-colors duration-200"
                placeholder="Jelaskan kondisi ekonomi, aset, dll..."
                rows="6"
            />
            <p className="text-xs text-gray-500 mb-6">
                Jelaskan kondisi ekonomi, aset (seperti rumah, kendaraan, dan lain-lain), 
                serta alasan mengapa yang bersangkutan layak untuk mendapatkan 
                Program Sekolah Rakyat
            </p>
            
            <div className="flex justify-between mt-6">
                <div className="w-1/3">
                    <Button label="Sebelumnya" variant="secondary" onClick={() => setStep(8)} />
                </div>
                <div className="w-1/3">
                     <Button label="Kirim" type="submit" variant="success" />
                </div>
            </div>
        </form>
    );
}