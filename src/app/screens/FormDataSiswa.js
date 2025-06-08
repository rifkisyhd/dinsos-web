"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Button from "../components/Button";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
        <form className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-center text-blue-600 font-bold mb-4">
                *** PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT ***
            </h2>
            <p className="text-green-600 font-semibold mb-2">
                Blok 1 - Data Diri Calon Siswa
            </p>

            <label className="block mb-2">Nama Lengkap</label>
            <input
                name="namaLengkap"
                value={form.namaLengkap}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan nama lengkap"
            />

            <label className="block mb-2">NIK</label>
            <input
                name="nik"
                value={form.nik}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan NIK"
            />

            <label className="block mb-2">Nomor KK</label>
            <input
                name="nomorKK"
                value={form.nomorKK}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan Nomor KK"
            />

            <label className="block mb-2">Tempat Lahir</label>
            <input
                name="tempatLahir"
                value={form.tempatLahir}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan Tempat Lahir"
            />

            <label className="block mb-2">Tanggal Lahir</label>
            <input
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
                type="date"
                className="w-full border p-2 mb-4"
            />

            <label className="block mb-2">Jenis Kelamin</label>
            <select
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
            >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
            </select>

            <label className="block mb-2">Agama</label>
            <select
                name="agama"
                value={form.agama}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
            >
                <option value="">Pilih Agama</option>
                {agamaList.map((item) => (
                    <option key={item.id} value={item.nama}>
                        {item.nama}
                    </option>
                ))}
            </select>

            <Button label="Selanjutnya" onClick={() => setStep(2)} />
        </form>
    );
}
