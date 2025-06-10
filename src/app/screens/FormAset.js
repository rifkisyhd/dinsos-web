"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "@/lib/supabaseClient";

import TitleForm from "../components/TitleForm";
import Button from "../components/Button";

export default function FormAset({ setStep }) {
    const [form, setForm] = useState({
        statusTanah: "",
        statusRumah: "",
        luasTanah: "",
        luasRumah: "",
        sumberPenerangan: "",
        idListrik: "",
    });

    // State untuk menampung opsi dari database
    const [statusKepemilikanOptions, setStatusKepemilikanOptions] = useState([]);
    const [sumberPeneranganOptions, setSumberPeneranganOptions] = useState([]);

    // State untuk loading dropdown
    const [isLoading, setIsLoading] = useState({
        status: true,
        penerangan: true,
    });

    useEffect(() => {
        // Fungsi untuk mengambil data status kepemilikan
        const fetchStatusKepemilikan = async () => {
            try {
                // Ganti "status_kepemilikan" dengan nama tabel Anda yang sebenarnya
                const { data, error } = await supabase.from("status_kepemilikan").select("nama");
                if (error) throw error;
                setStatusKepemilikanOptions(
                    data.map((item) => ({ value: item.nama, label: item.nama }))
                );
            } catch (error) {
                console.error("Error fetching status kepemilikan:", error.message);
            } finally {
                setIsLoading(prev => ({...prev, status: false}));
            }
        };

        // Fungsi untuk mengambil data sumber penerangan
        const fetchSumberPenerangan = async () => {
            try {
                // Ganti "sumber_penerangan" dengan nama tabel Anda yang sebenarnya
                const { data, error } = await supabase.from("sumber_penerangan").select("nama");
                if (error) throw error;
                setSumberPeneranganOptions(
                    data.map((item) => ({ value: item.nama, label: item.nama }))
                );
            } catch (error) {
                console.error("Error fetching sumber penerangan:", error.message);
            } finally {
                setIsLoading(prev => ({...prev, penerangan: false}));
            }
        };

        fetchStatusKepemilikan();
        fetchSumberPenerangan();
    }, []);

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    // Fungsi untuk handle submit, bisa ditambahkan nanti
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data Aset:", form);
        setStep(6); // Lanjut ke step berikutnya
    }

    return (
        <form 
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            onSubmit={handleSubmit}
        >
               <TitleForm blok=" Blok 5 - Aset Yang Dimiliki Keluarga" />

            <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepemilikan Tanah</label>
            <Select
                name="statusTanah"
                options={statusKepemilikanOptions}
                value={statusKepemilikanOptions.find(option => option.value === form.statusTanah)}
                onChange={(option) => handleChange("statusTanah", option.value)}
                isLoading={isLoading.status}
                placeholder={isLoading.status ? "Memuat..." : "Pilih Status Kepemilikan Tanah"}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepemilikan Rumah</label>
            <Select
                name="statusRumah"
                options={statusKepemilikanOptions}
                value={statusKepemilikanOptions.find(option => option.value === form.statusRumah)}
                onChange={(option) => handleChange("statusRumah", option.value)}
                isLoading={isLoading.status}
                placeholder={isLoading.status ? "Memuat..." : "Pilih Status Kepemilikan Rumah"}
                className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luas tanah (m²)</label>
                    <input
                        name="luasTanah"
                        type="number"
                        value={form.luasTanah}
                        onChange={(e) => handleChange("luasTanah", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                        placeholder="Contoh: 72"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luas Rumah (m²)</label>
                    <input
                        name="luasRumah"
                        type="number"
                        value={form.luasRumah}
                        onChange={(e) => handleChange("luasRumah", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                        placeholder="Contoh: 45"
                    />
                </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Penerangan</label>
            <Select
                name="sumberPenerangan"
                options={sumberPeneranganOptions}
                value={sumberPeneranganOptions.find(option => option.value === form.sumberPenerangan)}
                onChange={(option) => handleChange("sumberPenerangan", option.value)}
                isLoading={isLoading.penerangan}
                placeholder={isLoading.penerangan ? "Memuat..." : "Pilih Sumber Penerangan"}
                className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">ID Listrik <span className="text-gray-400">(Opsional)</span></label>
            <input
                name="idListrik"
                value={form.idListrik}
                onChange={(e) => handleChange("idListrik", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4 transition-colors duration-200"
                placeholder="1234xxx"
            />

            {/* Area Tombol */}
            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(4)} />
                <Button label="Selanjutnya" onClick={() => setStep(6)} />
            </div>
        </form>
    );
}