// src/screens/FormDokumen.js

"use client";

import { useState } from "react";
import Button from "../components/Button";
import FileInput from "../components/FileInput"; // <-- Import komponen baru kita
import { supabase } from "@/lib/supabaseClient";

export default function FormDokumen({ setStep }) {
    const [form, setForm] = useState({
        fotoSiswa: { file: null, name: "" },
        fotoOrangTua: { file: null, name: "" },
        fotoRumahDepan: { file: null, name: "" },
        fotoRumahDalam: { file: null, name: "" },
        fotoRumahSamping: { file: null, name: "" },
        suratPernyataan: { file: null, name: "" },
        sktm: { file: null, name: "" },
    });

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                [name]: { file: file, name: file.name },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Data Dokumen:", form);
    };

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
                Blok 8 - Dokumen Dan Foto Yang Di Butuhkan
            </p>

            <FileInput label="Foto calon siswa" fileType="JPG,PNG" name="fotoSiswa" fileName={form.fotoSiswa.name} onChange={handleFileChange} />
            <FileInput label="Foto orang tua" fileType="JPG,PNG" name="fotoOrangTua" fileName={form.fotoOrangTua.name} onChange={handleFileChange} />
            <FileInput label="Foto Rumah Tampak Depan" fileType="JPG,PNG" name="fotoRumahDepan" fileName={form.fotoRumahDepan.name} onChange={handleFileChange} />
            <FileInput label="Foto Rumah Tampak Dalam" fileType="JPG,PNG" name="fotoRumahDalam" fileName={form.fotoRumahDalam.name} onChange={handleFileChange} />
            <FileInput label="Foto Rumah Tampak Samping" fileType="JPG,PNG" name="fotoRumahSamping" fileName={form.fotoRumahSamping.name} onChange={handleFileChange} />
            <FileInput label="Surat Pernyataan Orang Tua" fileType="PDF" name="suratPernyataan" fileName={form.suratPernyataan.name} onChange={handleFileChange} />
            <FileInput label="Surat Keterangan Tidak Mampu (SKTM) - Opsional" fileType="PDF" name="sktm" fileName={form.sktm.name} onChange={handleFileChange} />

            {/* Area Tombol */}
            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(7)} /> 
                <Button label="Selanjutnya" onClick={() => setStep(9)} /> 
            </div>
        </form>
    );
}