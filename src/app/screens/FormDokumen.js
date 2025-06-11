"use client";

import Button from "../components/Button";
import FileInput from "../components/FileInput"; // <-- Import komponen baru kita
import { supabase } from "@/lib/supabaseClient";

export default function FormDokumen({ setStep, form, setForm }) {
    const handleFileChange = async (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            // Upload langsung ke Supabase Storage
            const { data, error } = await supabase.storage
                .from("uploads")
                .upload(`${name}/${file.name}`, file, { upsert: true });
            if (error) {
                alert("Upload gagal: " + error.message);
                return;
            }
            // Simpan hanya path hasil upload ke state
            setForm((prev) => ({
                ...prev,
                [name]: data.path,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { file } = form.fotoSiswa;
        const { data, error } = await supabase.storage
            .from("uploads")
            .upload(`foto_siswa/${file.name}`, file);
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
                Blok 8 - Dokumen Dan Foto Yang Di Butuhkan
            </p>

            <FileInput
                label="Foto calon siswa"
                fileType="JPG,PNG"
                name="fotoSiswa"
                fileName={form.fotoSiswa?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Foto orang tua"
                fileType="JPG,PNG"
                name="fotoOrangTua"
                fileName={form.fotoOrangTua?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Foto Rumah Tampak Depan"
                fileType="JPG,PNG"
                name="fotoRumahDepan"
                fileName={form.fotoRumahDepan?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Foto Rumah Tampak Dalam"
                fileType="JPG,PNG"
                name="fotoRumahDalam"
                fileName={form.fotoRumahDalam?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Foto Rumah Tampak Samping"
                fileType="JPG,PNG"
                name="fotoRumahSamping"
                fileName={form.fotoRumahSamping?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Surat Pernyataan Orang Tua"
                fileType="PDF"
                name="suratPernyataan"
                fileName={form.suratPernyataan?.split("/").pop() || ""}
                onChange={handleFileChange}
            />
            <FileInput
                label="Surat Keterangan Tidak Mampu (SKTM) - Opsional"
                fileType="PDF"
                name="sktm"
                fileName={form.sktm?.split("/").pop() || ""}
                onChange={handleFileChange}
            />

            {/* Area Tombol */}
            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(7)} />
                <Button label="Selanjutnya" onClick={() => setStep(9)} />
            </div>
        </form>
    );
}
