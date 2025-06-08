"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../components/Button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FormDataKeluarga({ setStep }) {
    const [form, setForm] = useState({
        ayah: "",
        ibu: "",
        pekerjaanAyah: "",
        pekerjaanIbu: "",
        penjelasanPekerjaan: "",
        wali: "",
        penghasilan: "",
        nominalPenghasilan: "",
        pengeluaran: "",
        nominalPengeluaran: "",
        jumlahTanggungan: "",
    });

    const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
    const [penghasilanOptions, setPenghasilanOptions] = useState([]);

    useEffect(() => {
        const fetchPekerjaan = async () => {
            try {
                const { data, error } = await supabase
                    .from("pekerjaan")
                    .select("*");

                if (error) throw error;
                setPekerjaanOptions(
                    data.map((item) => ({ value: item.nama, label: item.nama }))
                );
            } catch (error) {
                console.error("Error fetching pekerjaan:", error.message);
            }
        };

        const fetchPenghasilan = async () => {
            try {
                const { data, error } = await supabase
                    .from("penghasilan")
                    .select("*");

                if (error) throw error;
                setPenghasilanOptions(
                    data.map((item) => ({ value: item.range, label: item.range }))
                );
            } catch (error) {
                console.error("Error fetching penghasilan:", error.message);
            }
        };

        fetchPekerjaan();
        fetchPenghasilan();
    }, []);

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-center text-blue-600 font-bold mb-4">
                *** PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT ***
            </h2>
            <p className="text-green-600 font-semibold mb-2">
                Blok 4 - Data Keluarga
            </p>

            <label className="block mb-2">Ayah</label>
            <input
                name="ayah"
                value={form.ayah}
                onChange={(e) => handleChange("ayah", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nama ayah"
            />

            <label className="block mb-2">Ibu</label>
            <input
                name="ibu"
                value={form.ibu}
                onChange={(e) => handleChange("ibu", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nama ibu"
            />

            <label className="block mb-2">Pekerjaan Ayah sesuai KTP</label>
            <Select
                options={pekerjaanOptions}
                value={pekerjaanOptions.find((item) => item.value === form.pekerjaanAyah)}
                onChange={(selectedOption) => handleChange("pekerjaanAyah", selectedOption.value)}
                className="mb-4"
            />

            <label className="block mb-2">Pekerjaan Ibu sesuai KTP</label>
            <Select
                options={pekerjaanOptions}
                value={pekerjaanOptions.find((item) => item.value === form.pekerjaanIbu)}
                onChange={(selectedOption) => handleChange("pekerjaanIbu", selectedOption.value)}
                className="mb-4"
            />

            <label className="block mb-2">Penjelasan Pekerjaan Ayah dan Ibu</label>
            <textarea
                name="penjelasanPekerjaan"
                value={form.penjelasanPekerjaan}
                onChange={(e) => handleChange("penjelasanPekerjaan", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan penjelasan pekerjaan ayah dan ibu"
            />

            <label className="block mb-2">Wali Calon Siswa (Jika tidak memiliki orang tua)</label>
            <input
                name="wali"
                value={form.wali}
                onChange={(e) => handleChange("wali", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nama wali"
            />

            <label className="block mb-2 text-blue-600">Penghasilan Keluarga Perbulan</label>
            <Select
                options={penghasilanOptions}
                value={penghasilanOptions.find((item) => item.value === form.penghasilan)}
                onChange={(selectedOption) => handleChange("penghasilan", selectedOption.value)}
                className="mb-4"
            />

            <label className="block mb-2">Nominal Penghasilan Keluarga</label>
            <input
                name="nominalPenghasilan"
                value={form.nominalPenghasilan}
                onChange={(e) => handleChange("nominalPenghasilan", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nominal penghasilan keluarga"
            />

            <label className="block mb-2 text-yellow-600">Pengeluaran Keluarga Perbulan</label>
            <Select
                options={penghasilanOptions} // Gunakan penghasilanOptions untuk pengeluaran
                value={penghasilanOptions.find((item) => item.value === form.pengeluaran)}
                onChange={(selectedOption) => handleChange("pengeluaran", selectedOption.value)}
                className="mb-4"
            />

            <label className="block mb-2">Nominal Pengeluaran Keluarga</label>
            <input
                name="nominalPengeluaran"
                value={form.nominalPengeluaran}
                onChange={(e) => handleChange("nominalPengeluaran", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nominal pengeluaran keluarga"
            />

            <label className="block mb-2">Jumlah Tanggungan</label>
            <input
                name="jumlahTanggungan"
                value={form.jumlahTanggungan}
                onChange={(e) => handleChange("jumlahTanggungan", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan jumlah tanggungan"
            />

            <Button label="Sebelumnya" onClick={() => setStep(2)} />
            <Button label="Selanjutnya" onClick={() => setStep(5)} />
        </form>
    );
}