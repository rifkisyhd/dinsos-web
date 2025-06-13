"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Button from "../components/Button";
import TitleForm from "../components/TitleForm";

// Sebaiknya client ini dipindah ke file terpisah (misal: src/lib/supabaseClient.js)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Helper function untuk membuat key yang aman untuk state dari nama bantuan
const generateKeyFromName = (name) => {
    return name.replace(/\s+/g, "_").toLowerCase();
};

export default function FormDataSiswa({ setStep, form, setForm }) {
    // State untuk data dari database
    const [agamaList, setAgamaList] = useState([]);
    const [jenjangList, setJenjangList] = useState([]);
    const [kondisiFisikList, setKondisiFisikList] = useState([]);
    const [bansosList, setBansosList] = useState([]);
    // --- PENAMBAHAN STATE BARU ---
    const [bersediaTinggalList, setBersediaTinggalList] = useState([]);
    const [tandaTanganList, setTandaTanganList] = useState([]);
    // --- AKHIR PENAMBAHAN STATE BARU ---

    // State untuk status loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mengambil semua data secara bersamaan
                // --- TAMBAHKAN FETCH DATA BARU ---
                const [agamaRes, jenjangRes, kondisiFisikRes, bansosRes, bersediaTinggalRes, tandaTanganRes] =
                    await Promise.all([
                        supabase.from("agama").select("*"),
                        supabase.from("jenjang").select("*"),
                        supabase.from("kondisi_fisik").select("*"),
                        supabase.from("bansos").select("*"),
                        supabase.from("bersedia_tinggal").select("*"), // Ambil data dari tabel bersedia_tinggal
                        supabase.from("tanda_tangan").select("*"),    // Ambil data dari tabel tanda_tangan
                    ]);
                // --- AKHIR PENAMBAHAN FETCH DATA ---

                if (agamaRes.error) throw agamaRes.error;
                if (jenjangRes.error) throw jenjangRes.error;
                if (kondisiFisikRes.error) throw kondisiFisikRes.error;
                if (bansosRes.error) throw bansosRes.error;
                // --- TAMBAHKAN VALIDASI ERROR ---
                if (bersediaTinggalRes.error) throw bersediaTinggalRes.error;
                if (tandaTanganRes.error) throw tandaTanganRes.error;
                // --- AKHIR VALIDASI ERROR ---

                setAgamaList(agamaRes.data);
                setJenjangList(jenjangRes.data);
                setKondisiFisikList(kondisiFisikRes.data);
                setBansosList(bansosRes.data);
                // --- TAMBAHKAN SET STATE BARU ---
                setBersediaTinggalList(bersediaTinggalRes.data);
                setTandaTanganList(tandaTanganRes.data);
                // --- AKHIR SET STATE BARU ---

            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                bansos: {
                    ...(prev.bansos || {}), // ensure bansos exists
                    [name]: checked,
                },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <TitleForm blok=" Blok 2 - Data Diri Calon Siswa" />

            {/* Input Nama Lengkap sampai Jenis Kelamin (tidak berubah) */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
            </label>
            <input
                name="namaLengkap"
                value={form.namaLengkap || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                placeholder="Masukkan nama lengkap"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
            </label>
            <input
                name="nik"
                type="number"
                value={form.nik || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                placeholder="Masukkan 16 digit NIK"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor KK
            </label>
            <input
                name="nomorKK"
                type="number"
                value={form.nomorKK || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                placeholder="Masukkan 16 digit Nomor KK"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
            </label>
            <input
                name="tempatLahir"
                value={form.tempatLahir || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                placeholder="Masukkan Tempat Lahir"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
            </label>
            <input
                name="tanggalLahir"
                value={form.tanggalLahir || ""}
                onChange={handleChange}
                type="date"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
            </label>
            <select
                name="jenisKelamin"
                value={form.jenisKelamin || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Agama
            </label>
            <select
                name="agama"
                value={form.agama || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                {loading ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        {" "}
                        <option value="">Pilih Agama</option>{" "}
                        {agamaList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}{" "}
                    </>
                )}
            </select>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anak Ke-
                    </label>
                    <input
                        name="anakKe"
                        type="number"
                        value={form.anakKe || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        placeholder="Anak Ke-"
                    />
                </div>
                <span className="mt-7">Dari</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        &nbsp;
                    </label>
                    <input
                        name="dariSaudara"
                        type="number"
                        value={form.dariSaudara || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        placeholder="... Saudara"
                    />
                </div>
            </div>
                -
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenjang yang dipilih
            </label>
            <select
                name="jenjang"
                value={form.jenjang || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                {loading ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        {" "}
                        <option value="">Pilih Jenjang</option>{" "}
                        {jenjangList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}{" "}
                    </>
                )}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi Fisik
            </label>
            <select
                name="kondisiFisik"
                value={form.kondisiFisik || ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                {loading ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        {" "}
                        <option value="">Pilih Kondisi Fisik</option>{" "}
                        {kondisiFisikList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}{" "}
                    </>
                )}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Masuk DTSEN desil ke</label>
            <input name="dtsenDesil" type="number" value={form.dtsenDesil || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4" placeholder="Masukkan desil (jika ada)" />

            <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah Asal</label>
            <input name="sekolahAsal" value={form.sekolahAsal || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4" placeholder="Masukkan sekolah asal" />

            {/* --- KODE DIUBAH DI SINI --- */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Apakah bersedia tinggal di asrama?</label>
            <select name="bersediaAsrama" value={form.bersediaAsrama || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                {loading ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        <option value="">Pilih Jawaban</option>
                        {bersediaTinggalList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}
                    </>
                )}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Apakah sudah menandatangani surat pernyataan?</label>
            <select name="sudahPernyataan" value={form.sudahPernyataan || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4">
                {loading ? (
                    <option>Memuat...</option>
                ) : (
                    <>
                        <option value="">Pilih Jawaban</option>
                        {tandaTanganList.map((item) => (
                            <option key={item.id} value={item.nama}>
                                {item.nama}
                            </option>
                        ))}
                    </>
                )}
            </select>
            {/* --- AKHIR PERUBAHAN KODE --- */}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bansos Yang Diterima
                </label>
                {loading ? (
                    <p className="text-sm text-gray-500">
                        Memuat opsi bantuan...
                    </p>
                ) : (
                    <div className="space-y-2">
                        {bansosList.map((option) => {
                            const key = generateKeyFromName(option.nama);
                            return (
                                <div
                                    key={option.id}
                                    className="flex items-center">
                                    <input
                                        id={key}
                                        name={key}
                                        type="checkbox"
                                        checked={form.bansos?.[key] || false}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={key}
                                        className="ml-2 block text-sm text-gray-900">
                                        {option.nama}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}
                <p className="text-xs text-red-500 mt-2">
                    Anda harus memilih setidaknya satu opsi.
                </p>
            </div>

            <div className="flex justify-between mt-6 gap-8">
                <Button label="Sebelumnya" onClick={() => setStep(1)} />
                <Button label="Selanjutnya" onClick={() => setStep(3)} />
            </div>
        </form>
    );
}   