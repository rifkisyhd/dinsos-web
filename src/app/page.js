"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

import FormPetugas from "./screens/FormPetugas";
import FormDataSiswa from "./screens/FormDataSiswa";
import FormTempatTinggal from "./screens/FormTempatTinggal";
import FormDataKeluarga from "./screens/FormDataKeluarga";
import FormAset from "./screens/FormAset";
import FormDataUsaha from "./screens/FormDataUsaha";
import FormInfoTambahan from "./screens/FormInfoTambahan";
import FormDokumen from "./screens/FormDokumen";
import FormCatatan from "./screens/FormCatatan";

export default function Page() {
    const [step, setStep] = useState(1);

    // State untuk setiap form
    const [formSiswa, setFormSiswa] = useState({});
    const [formTempatTinggal, setFormTempatTinggal] = useState({
        provinsi: "35",
    });
    const [formKeluarga, setFormKeluarga] = useState({});
    const [formAset, setFormAset] = useState({});
    const [formUsaha, setFormUsaha] = useState({});
    const [formInfoTambahan, setFormInfoTambahan] = useState({});
    const [formDokumen, setFormDokumen] = useState({});
    const [formCatatan, setFormCatatan] = useState({});
    const [formPetugas, setFormPetugas] = useState({});

    // Gabungkan semua data form
    const allFormData = {
        ...formPetugas,
        ...formSiswa,
        ...formTempatTinggal,
        ...formKeluarga,
        ...formAset,
        ...formUsaha,
        ...formInfoTambahan,
        ...formDokumen,
        ...formCatatan,
    };

    // Fungsi untuk submit semua data ke Supabase
    const submitAllData = async (catatanData) => {
        // Gabungkan semua data form dengan catatan terakhir
        const finalData = { ...allFormData, ...catatanData };
        // Mapping camelCase ke snake_case untuk kolom Supabase
        const mappedData = {
            ...finalData,
            id_listrik: finalData.idListrik,
            luas_rumah: finalData.luasRumah,
            luas_tanah: finalData.luasTanah,
            nominal_pengeluaran: finalData.nominalPengeluaran,
            nominal_penghasilan: finalData.nominalPenghasilan,
            pekerjaan_ayah: finalData.pekerjaanAyah,
            pekerjaan_ibu: finalData.pekerjaanIbu,
            penjelasan_pekerjaan: finalData.penjelasanPekerjaan,
            status_rumah: finalData.statusRumah,
            status_tanah: finalData.statusTanah,
            sumber_penerangan: finalData.sumberPenerangan,
            jumlah_tanggungan: finalData.jumlahTanggungan,
            jenis_usaha: finalData.jenisUsahaId,
            produk_usaha: finalData.produkUsaha,
            foto_produk: finalData.fileName,
            foto_siswa: finalData.fotoSiswa, // sudah berupa string path
            foto_orang_tua: finalData.fotoOrangTua,
            foto_rumah_depan: finalData.fotoRumahDepan,
            foto_rumah_dalam: finalData.fotoRumahDalam,
            foto_rumah_samping: finalData.fotoRumahSamping,
            surat_pernyataan: finalData.suratPernyataan,
            sktm: finalData.sktm,
            nama_petugas: finalData.namaPetugas,
            nomor_hp_petugas: finalData.nomorHpPetugas,
            lokasi: finalData.lokasi,
        };
        delete mappedData.idListrik;
        delete mappedData.luasRumah;
        delete mappedData.luasTanah;
        delete mappedData.nominalPengeluaran;
        delete mappedData.nominalPenghasilan;
        delete mappedData.pekerjaanAyah;
        delete mappedData.pekerjaanIbu;
        delete mappedData.penjelasanPekerjaan;
        delete mappedData.statusRumah;
        delete mappedData.statusTanah;
        delete mappedData.sumberPenerangan;
        delete mappedData.jumlahTanggungan;
        delete mappedData.jenisUsahaId;
        delete mappedData.produkUsaha;
        delete mappedData.fileName;
        delete mappedData.file;
        delete mappedData.filePreview;
        delete mappedData.namaPetugas;
        delete mappedData.nomorHpPetugas;
        delete mappedData.lokasi;
        delete mappedData.catatan;
        try {
            const { error } = await supabase
                .from("tb_input")
                .insert(mappedData);
            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal simpan data",
                    text: error.message,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data berhasil disimpan ke database!",
                });
                setStep(1);
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Terjadi error",
                text: err.message,
            });
        }
    };

    return (
        <>
            {step === 1 && (
                <FormPetugas
                    setStep={setStep}
                    form={formPetugas}
                    setForm={setFormPetugas}
                />
            )}
            {step === 2 && (
                <FormDataSiswa
                    setStep={setStep}
                    form={formSiswa}
                    setForm={setFormSiswa}
                />
            )}
            {step === 3 && (
                <FormTempatTinggal
                    setStep={setStep}
                    form={formTempatTinggal}
                    setForm={setFormTempatTinggal}
                />
            )}
            {step === 4 && (
                <FormDataKeluarga
                    setStep={setStep}
                    form={formKeluarga}
                    setForm={setFormKeluarga}
                />
            )}
            {step === 5 && (
                <FormAset
                    setStep={setStep}
                    form={formAset}
                    setForm={setFormAset}
                />
            )}
            {step === 6 && (
                <FormDataUsaha
                    setStep={setStep}
                    form={formUsaha}
                    setForm={setFormUsaha}
                    allFormData={allFormData}
                />
            )}
            {step === 7 && (
                <FormInfoTambahan
                    setStep={setStep}
                    form={formInfoTambahan}
                    setForm={setFormInfoTambahan}
                />
            )}
            {step === 8 && (
                <FormDokumen
                    setStep={setStep}
                    form={formDokumen}
                    setForm={setFormDokumen}
                />
            )}
            {step === 9 && (
                <FormCatatan setStep={setStep} submitAllData={submitAllData} />
            )}
        </>
    );
}
