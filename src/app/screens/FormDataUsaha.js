"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

import TitleForm from "../components/TitleForm";
import Button from "../components/Button";

export default function FormDataUsaha({ setStep, form, setForm, allFormData }) {
    const [jenisUsahaOptions, setJenisUsahaOptions] = useState([]);

    useEffect(() => {
        const fetchJenisUsaha = async () => {
            const { data, error } = await supabase
                .from("jenis_usaha")
                .select("*");
            if (error) console.error(error);
            setJenisUsahaOptions(
                data.map((item) => ({ value: item.id, label: item.nama })),
            );
        };

        fetchJenisUsaha();
    }, []);

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file); // Buat URL preview
            setForm((prev) => ({
                ...prev,
                file: file,
                fileName: file.name,
                filePreview: filePreview,
            }));
        }
    };

    const handleRemoveFile = () => {
        setForm((prev) => ({
            ...prev,
            file: null,
            fileName: "",
            filePreview: null,
        }));
    };

    // Tambahkan handleSubmit agar tidak error saat submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Tidak melakukan submit ke database di sini, hanya mencegah reload
    };

    return (
        <form
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            onSubmit={handleSubmit}>
            <TitleForm blok=" Blok 6 - Data Usaha (Optional/Tidak Wajib Diisi) " />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Usaha
            </label>
            <select
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                value={form.jenisUsahaId}
                onChange={(e) => handleChange("jenisUsahaId", e.target.value)}>
                <option value="">Pilih Jenis Usaha</option>
                {jenisUsahaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Produk Usaha
            </label>
            <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                value={form.produkUsaha}
                onChange={(e) => handleChange("produkUsaha", e.target.value)}
                placeholder="Masukkan produk usaha"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Produk/Tempat (JPG, PNG)
            </label>
            {form.file ? (
                <div className="mb-4">
                    <Image
                        src={form.filePreview}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-700">
                        File: {form.fileName}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            label="Hapus File"
                            type="button"
                            onClick={handleRemoveFile}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        />
                        <Button
                            label="Ganti File"
                            type="button"
                            onClick={() =>
                                document.getElementById("fileInput").click()
                            }
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        />
                    </div>
                </div>
            ) : (
                <input
                    id="fileInput"
                    type="file"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                    onChange={handleFileChange}
                />
            )}
            <p className="text-sm text-red-500 mb-4">Maksimal 2 Mb</p>

            <div className="flex justify-between mt-6 gap-8">
                <Button
                    label="Sebelumnya"
                    type="button"
                    onClick={() => setStep(5)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                />
                <Button
                    label="Reset"
                    type="reset"
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                />
                <Button
                    label="Selanjutnya"
                    type="button"
                    onClick={() => setStep(7)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                />
            </div>
        </form>
    );
}
