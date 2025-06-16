"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { createClient } from "@supabase/supabase-js";

import TitleForm from "../components/TitleForm";
import Button from "../components/Button";

// Sebaiknya client ini dipindah ke file terpisah (misal: src/lib/supabaseClient.js)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function FormDataKeluarga({ setStep, form, setForm }) {
    const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
    const [penghasilanOptions, setPenghasilanOptions] = useState([]);

    useEffect(() => {
        // ... (logika fetch data Anda tidak perlu diubah, sudah bagus)
        const fetchPekerjaan = async () => {
            try {
                const { data, error } = await supabase
                    .from("pekerjaan")
                    .select("*");
                if (error) throw error;
                setPekerjaanOptions(
                    data.map((item) => ({
                        value: item.nama,
                        label: item.nama,
                    })),
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
                    data.map((item) => ({
                        value: item.range,
                        label: item.range,
                    })),
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
        <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <TitleForm blok=" Blok 4 - Data Keluarga" />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Ayah
            </label>
            <input
                name="ayah"
                value={form.ayah || ""}
                onChange={(e) => handleChange("ayah", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan nama ayah"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Ibu
            </label>
            <input
                name="ibu"
                value={form.ibu || ""}
                onChange={(e) => handleChange("ibu", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan nama ibu"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Pekerjaan Ayah sesuai KTP
            </label>
            <Select
                options={pekerjaanOptions}
                value={pekerjaanOptions.find(
                    (item) => item.value === form.pekerjaanAyah,
                )}
                onChange={(selectedOption) =>
                    handleChange("pekerjaanAyah", selectedOption.value)
                }
                className="mb-4"
                placeholder="Pilih Pekerjaan Ayah"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Pekerjaan Ibu sesuai KTP
            </label>
            <Select
                options={pekerjaanOptions}
                value={pekerjaanOptions.find(
                    (item) => item.value === form.pekerjaanIbu,
                )}
                onChange={(selectedOption) =>
                    handleChange("pekerjaanIbu", selectedOption.value)
                }
                className="mb-4"
                placeholder="Pilih Pekerjaan Ibu"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Penjelasan Pekerjaan Ayah dan Ibu
            </label>
            <textarea
                name="penjelasanPekerjaan"
                value={form.penjelasanPekerjaan || ""}
                onChange={(e) =>
                    handleChange("penjelasanPekerjaan", e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Contoh: Ayah bekerja serabutan, Ibu di rumah saja"
                rows="3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Wali Calon Siswa (Jika tidak memiliki orang tua)
            </label>
            <input
                name="wali"
                value={form.wali || ""}
                onChange={(e) => handleChange("wali", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan nama wali (opsional)"
            />

            <label className="block text-sm font-medium text-blue-600 mb-1">
                Penghasilan Keluarga Perbulan
            </label>
            <Select
                options={penghasilanOptions}
                value={penghasilanOptions.find(
                    (item) => item.value === form.penghasilan,
                )}
                onChange={(selectedOption) =>
                    handleChange("penghasilan", selectedOption.value)
                }
                className="mb-4"
                placeholder="Pilih Range Penghasilan"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal Penghasilan Keluarga
            </label>
            <input
                name="nominalPenghasilan"
                type="number"
                value={form.nominalPenghasilan || ""}
                onChange={(e) =>
                    handleChange("nominalPenghasilan", e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Contoh: 1500000"
            />

            <label className="block text-sm font-medium text-yellow-600 mb-1">
                Pengeluaran Keluarga Perbulan
            </label>
            <Select
                options={penghasilanOptions}
                value={penghasilanOptions.find(
                    (item) => item.value === form.pengeluaran,
                )}
                onChange={(selectedOption) =>
                    handleChange("pengeluaran", selectedOption.value)
                }
                className="mb-4"
                placeholder="Pilih Range Pengeluaran"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal Pengeluaran Keluarga
            </label>
            <input
                name="nominalPengeluaran"
                type="number"
                value={form.nominalPengeluaran || ""}
                onChange={(e) =>
                    handleChange("nominalPengeluaran", e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Contoh: 1000000"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Tanggungan
            </label>
            <input
                name="jumlahTanggungan"
                type="number"
                value={form.jumlahTanggungan || ""}
                onChange={(e) =>
                    handleChange("jumlahTanggungan", e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="Masukkan jumlah orang yang ditanggung"
            />

            {/* Area Tombol yang sudah responsif */}
            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(3)} />
                <Button label="Selanjutnya" onClick={() => setStep(5)} />
            </div>
        </form>
    );
}
