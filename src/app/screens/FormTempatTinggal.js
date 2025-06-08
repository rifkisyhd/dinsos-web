"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../components/Button";

export default function FormTempatTinggal({ setStep }) {
    const [form, setForm] = useState({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kelurahan: "",
        rw: "",
        rt: "",
        alamat: "",
    });

    const [kabupatenList, setKabupatenList] = useState([]);
    const [kecamatanList, setKecamatanList] = useState([]);
    const [kelurahanList, setKelurahanList] = useState([]);

    useEffect(() => {
        // Fetch Kabupaten Jawa Timur
        const fetchKabupaten = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_WILAYAH}/regencies/35.json` // ID Jawa Timur adalah 35
                );
                const data = await response.json();
                setKabupatenList(
                    data.map((item) => ({ value: item.id, label: item.name }))
                );
            } catch (error) {
                console.error("Error fetching kabupaten:", error.message);
            }
        };

        fetchKabupaten();
    }, []);

    const fetchKecamatan = async (kabupatenId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_WILAYAH}/districts/${kabupatenId}.json`
            );
            const data = await response.json();
            setKecamatanList(
                data.map((item) => ({ value: item.id, label: item.name }))
            );
        } catch (error) {
            console.error("Error fetching kecamatan:", error.message);
        }
    };

    const fetchKelurahan = async (kecamatanId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_WILAYAH}/villages/${kecamatanId}.json`
            );
            const data = await response.json();
            setKelurahanList(
                data.map((item) => ({ value: item.id, label: item.name }))
            );
        } catch (error) {
            console.error("Error fetching kelurahan:", error.message);
        }
    };

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
                Blok 2 - Tempat Tinggal
            </p>

            {/* Provinsi */}
            <label className="block mb-2">Provinsi</label>
            <Select
                options={[{ value: "35", label: "Jawa Timur" }]} // Jawa Timur tetap
                value={{ value: form.provinsi, label: "Jawa Timur" }}
                onChange={(selectedOption) =>
                    handleChange("provinsi", selectedOption.value)
                }
                className="mb-4"
            />

            {/* Kabupaten */}
            <label className="block mb-2">Kabupaten / Kota</label>
            <Select
                options={kabupatenList}
                value={kabupatenList.find((item) => item.value === form.kabupaten)}
                onChange={(selectedOption) => {
                    handleChange("kabupaten", selectedOption.value);
                    fetchKecamatan(selectedOption.value); // Fetch Kecamatan berdasarkan Kabupaten
                }}
                className="mb-4"
            />

            {/* Kecamatan */}
            <label className="block mb-2">Kecamatan</label>
            <Select
                options={kecamatanList}
                value={kecamatanList.find((item) => item.value === form.kecamatan)}
                onChange={(selectedOption) => {
                    handleChange("kecamatan", selectedOption.value);
                    fetchKelurahan(selectedOption.value); // Fetch Kelurahan berdasarkan Kecamatan
                }}
                className="mb-4"
            />

            {/* Kelurahan */}
            <label className="block mb-2">Kelurahan / Desa</label>
            <Select
                options={kelurahanList}
                value={kelurahanList.find((item) => item.value === form.kelurahan)}
                onChange={(selectedOption) =>
                    handleChange("kelurahan", selectedOption.value)
                }
                className="mb-4"
            />

            {/* RW */}
            <label className="block mb-2">RW</label>
            <input
                name="rw"
                value={form.rw}
                onChange={(e) => handleChange("rw", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan RW"
            />

            {/* RT */}
            <label className="block mb-2">RT</label>
            <input
                name="rt"
                value={form.rt}
                onChange={(e) => handleChange("rt", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan RT"
            />

            {/* Alamat */}
            <label className="block mb-2">Alamat</label>
            <textarea
                name="alamat"
                value={form.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Masukkan alamat lengkap"
            />

            <Button label="Sebelumnya" onClick={() => setStep(1)} />
            <Button label="Selanjutnya" onClick={() => setStep(3)} />
        </form>
    );
}
