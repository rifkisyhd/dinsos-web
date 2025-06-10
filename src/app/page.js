"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    const [formTempatTinggal, setFormTempatTinggal] = useState({});
    const [formKeluarga, setFormKeluarga] = useState({});
    const [formAset, setFormAset] = useState({});
    const [formUsaha, setFormUsaha] = useState({});
    const [formInfoTambahan, setFormInfoTambahan] = useState({});
    const [formDokumen, setFormDokumen] = useState({});
    const [formCatatan, setFormCatatan] = useState({});

    // Gabungkan semua data form
    const allFormData = {
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
        try {
            const { error } = await supabase
                .from("tb_input")
                .insert(mappedData);
            if (error) {
                alert("Gagal simpan data: " + error.message);
            } else {
                alert("Data berhasil disimpan ke database!");
                setStep(1);
            }
        } catch (err) {
            alert("Terjadi error: " + err.message);
        }
    };

    return (
        <>
            {step === 1 && <FormPetugas setStep={setStep} step={step} />}
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
