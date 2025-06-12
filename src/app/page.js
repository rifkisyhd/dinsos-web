"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";
import { generateAssessmentPDF } from "./components/pdfTemplate";

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
        try {
            // Gabungkan semua data form dengan catatan terakhir
            const finalData = { ...allFormData, ...catatanData };
            const dokumen = formDokumen; // Gunakan formDokumen, bukan allFormData

            // Upload file satu per satu jika ada
            const uploadFile = async (name, file) => {
                if (!file) return "";
                const { data, error } = await supabase.storage
                    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads")
                    .upload(`${name}/${Date.now()}_${file.name}`, file, {
                        upsert: true,
                    });
                if (error) {
                    throw new Error(error.message);
                }
                return data.path;
            };

            // Upload semua file dokumen
            const fotoSiswaPath = await uploadFile(
                "fotoSiswa",
                dokumen.fotoSiswa,
            );
            const fotoOrangTuaPath = await uploadFile(
                "fotoOrangTua",
                dokumen.fotoOrangTua,
            );
            const fotoRumahDepanPath = await uploadFile(
                "fotoRumahDepan",
                dokumen.fotoRumahDepan,
            );
            const fotoRumahDalamPath = await uploadFile(
                "fotoRumahDalam",
                dokumen.fotoRumahDalam,
            );
            const fotoRumahSampingPath = await uploadFile(
                "fotoRumahSamping",
                dokumen.fotoRumahSamping,
            );
            const suratPernyataanPath = await uploadFile(
                "suratPernyataan",
                dokumen.suratPernyataan,
            );
            const sktmPath = await uploadFile("sktm", dokumen.sktm);

            // Mapping ke snake_case
            const mappedData = {
                // Data siswa & keluarga
                nama_lengkap: finalData.namaLengkap,
                nama: finalData.nama,
                nik: finalData.nik,
                no_kk: finalData.noKk,
                nomor_kk: finalData.nomorKk,
                tempat_lahir: finalData.tempatLahir,
                tanggal_lahir: finalData.tanggalLahir,
                jenis_kelamin: finalData.jenisKelamin,
                alamat: finalData.alamat,
                provinsi: finalData.provinsi,
                kabupaten: finalData.kabupaten,
                kecamatan: finalData.kecamatan,
                kelurahan: finalData.kelurahan,
                rt: finalData.rt,
                rw: finalData.rw,
                agama: finalData.agama,
                fisik: finalData.fisik,
                ayah: finalData.ayah,
                ibu: finalData.ibu,
                wali: finalData.wali,

                // Data ekonomi
                penghasilan: finalData.penghasilan,
                nominal_penghasilan: finalData.nominalPenghasilan,
                pengeluaran: finalData.pengeluaran,
                nominal_pengeluaran: finalData.nominalPengeluaran,
                pekerjaan_ayah: finalData.pekerjaanAyah,
                penjelasan_pekerjaan: finalData.penjelasanPekerjaan,
                pekerjaan_ibu: finalData.pekerjaanIbu,
                jumlah_tanggungan: finalData.jumlahTanggungan,

                // Data tempat tinggal
                status_tanah: finalData.statusTanah,
                status_rumah: finalData.statusRumah,
                luas_tanah: finalData.luasTanah,
                luas_rumah: finalData.luasRumah,
                sumber_penerangan: finalData.sumberPenerangan,
                id_listrik: finalData.idListrik,

                // Data usaha
                jenis_usaha: finalData.jenisUsahaId,
                produk_usaha: finalData.produkUsaha,
                foto_produk: await uploadFile("fotoProduk", dokumen.fotoProduk),

                // Path dokumen
                foto_siswa: fotoSiswaPath,
                foto_orang_tua: fotoOrangTuaPath,
                foto_rumah_depan: fotoRumahDepanPath,
                foto_rumah_dalam: fotoRumahDalamPath,
                foto_rumah_samping: fotoRumahSampingPath,
                surat_pernyataan: suratPernyataanPath,
                sktm: sktmPath,

                // Data petugas
                nama_petugas: finalData.namaPetugas,
                nomor_hp_petugas: finalData.nomorHpPetugas,
                lokasi: finalData.lokasi,
                catatan: finalData.catatan,
            };

            // Insert ke database
            const { error } = await supabase
                .from("tb_input")
                .insert(mappedData);

            if (error) {
                throw new Error(error.message);
            }

            // Tampilkan alert sukses dengan opsi export PDF
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil disimpan ke database!",
                showCancelButton: true,
                confirmButtonText: "Jadi PDF",
                cancelButtonText: "Tutup",
            }).then((result) => {
                if (result.isConfirmed) {
                    generateAssessmentPDF(mappedData);
                }
            });

            setStep(1); // Kembali ke awal
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
