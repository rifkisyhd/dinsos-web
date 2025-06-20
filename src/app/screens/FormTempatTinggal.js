"use client";

import { useState, useEffect } from "react";
import Select from "react-select";

import TitleForm from "../components/TitleForm";
import Button from "../components/Button";
import {
    requiredFields,
    validateFormWithAlert,
} from "../components/formValidation";

export default function FormTempatTinggal({ setStep }) {
    const [form, setForm] = useState({
        provinsi: "Jawa Timur",
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
    const [isLoading, setIsLoading] = useState({
        kabupaten: true,
        kecamatan: false,
        kelurahan: false,
    });

    useEffect(() => {
        const fetchKabupaten = async () => {
            setIsLoading((prev) => ({ ...prev, kabupaten: true }));
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_WILAYAH}/regencies/35.json`,
                );
                const data = await response.json();
                setKabupatenList(
                    data.map((item) => ({ value: item.id, label: item.name })),
                );
            } catch (error) {
                console.error("Error fetching kabupaten:", error.message);
            } finally {
                setIsLoading((prev) => ({ ...prev, kabupaten: false }));
            }
        };

        fetchKabupaten();
    }, []);

    const fetchKecamatan = async (kabupatenId) => {
        setIsLoading((prev) => ({
            ...prev,
            kecamatan: true,
            kelurahan: false,
        }));
        setKecamatanList([]);
        setKelurahanList([]);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_WILAYAH}/districts/${kabupatenId}.json`,
            );
            const data = await response.json();
            setKecamatanList(
                data.map((item) => ({ value: item.id, label: item.name })),
            );
        } catch (error) {
            console.error("Error fetching kecamatan:", error.message);
        } finally {
            setIsLoading((prev) => ({ ...prev, kecamatan: false }));
        }
    };

    const fetchKelurahan = async (kecamatanId) => {
        setIsLoading((prev) => ({ ...prev, kelurahan: true }));
        setKelurahanList([]);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_WILAYAH}/villages/${kecamatanId}.json`,
            );
            const data = await response.json();
            setKelurahanList(
                data.map((item) => ({ value: item.id, label: item.name })),
            );
        } catch (error) {
            console.error("Error fetching kelurahan:", error.message);
        } finally {
            setIsLoading((prev) => ({ ...prev, kelurahan: false }));
        }
    };

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => {
        if (
            !validateFormWithAlert(
                form,
                requiredFields.tempatTinggal,
                "Semua data tempat tinggal wajib diisi!",
            )
        ) {
            return;
        }
        setStep(4);
    };

    return (
        <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <TitleForm blok=" Blok 3 - Tempat Tinggal Siswa" />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Provinsi
            </label>
            <Select
                options={[{ value: "35", label: "Jawa Timur" }]}
                value={{ value: "35", label: "Jawa Timur" }}
                isDisabled={true}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Kabupaten / Kota
            </label>
            <Select
                options={kabupatenList}
                value={kabupatenList.find(
                    (item) => item.value === form.kabupaten,
                )}
                onChange={(selectedOption) => {
                    handleChange("kabupaten", selectedOption.label);
                    fetchKecamatan(selectedOption.value);
                }}
                isLoading={isLoading.kabupaten}
                placeholder={
                    isLoading.kabupaten ? "Memuat..." : "Pilih Kabupaten / Kota"
                }
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan
            </label>
            <Select
                options={kecamatanList}
                value={kecamatanList.find(
                    (item) => item.value === form.kecamatan,
                )}
                onChange={(selectedOption) => {
                    handleChange("kecamatan", selectedOption.label);
                    fetchKelurahan(selectedOption.value);
                }}
                isLoading={isLoading.kecamatan}
                placeholder={
                    isLoading.kecamatan ? "Memuat..." : "Pilih Kecamatan"
                }
                isDisabled={!form.kabupaten || isLoading.kecamatan}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelurahan / Desa
            </label>
            <Select
                options={kelurahanList}
                value={kelurahanList.find(
                    (item) => item.value === form.kelurahan,
                )}
                onChange={(selectedOption) =>
                    handleChange("kelurahan", selectedOption.label)
                }
                isLoading={isLoading.kelurahan}
                placeholder={
                    isLoading.kelurahan ? "Memuat..." : "Pilih Kelurahan / Desa"
                }
                isDisabled={!form.kecamatan || isLoading.kelurahan}
                className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        RW
                    </label>
                    <input
                        name="rw"
                        value={form.rw || ""}
                        onChange={(e) => handleChange("rw", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                        placeholder="Contoh: 005"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        RT
                    </label>
                    <input
                        name="rt"
                        value={form.rt || ""}
                        onChange={(e) => handleChange("rt", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                        placeholder="Contoh: 001"
                    />
                </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap
            </label>
            <textarea
                name="alamat"
                value={form.alamat || ""}
                onChange={(e) => handleChange("alamat", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan nama jalan, nomor rumah, atau patokan lainnya"
                rows="3"
            />

            {/* Area Tombol yang sudah diperbaiki */}
            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(2)} />
                <Button label="Selanjutnya" onClick={handleNext} />
            </div>
        </form>
    );
}
