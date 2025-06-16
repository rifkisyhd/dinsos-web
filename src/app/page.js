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

    // Fungsi untuk submit semua data ke Supabase (versi yang sudah diperbaiki)
    const submitAllData = async (catatanData) => {
        try {
            // Gabungkan semua data form dengan catatan terakhir
            const finalData = { ...allFormData, ...catatanData };
            const dokumen = formDokumen;

            const uploadFile = async (name, file) => {
                if (!file) return "";
                try {
                    const { data, error } = await supabase.storage
                        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads")
                        .upload(`${name}/${Date.now()}_${file.name}`, file, { upsert: true });
                    if (error) throw new Error(error.message);
                    return data.path;
                } catch (error) {
                    console.error(`Error uploading ${name}:`, error);
                    throw error;
                }
            };

            // Upload semua file dokumen (logika ini tetap sama)
            const fotoSiswaPath = await uploadFile("fotoSiswa", dokumen.fotoSiswa);
            const fotoOrangTuaPath = await uploadFile("fotoOrangTua", dokumen.fotoOrangTua);
            const fotoRumahDepanPath = await uploadFile("fotoRumahDepan", dokumen.fotoRumahDepan);
            const fotoRumahDalamPath = await uploadFile("fotoRumahDalam", dokumen.fotoRumahDalam);
            const fotoRumahSampingPath = await uploadFile("fotoRumahSamping", dokumen.fotoRumahSamping);
            const suratPernyataanPath = await uploadFile("suratPernyataan", dokumen.suratPernyataan);
            const sktmPath = await uploadFile("sktm", dokumen.sktm);

            // Mapping ke snake_case (logika ini tetap sama)
            const mappedData = {
                nama_lengkap: finalData.namaLengkap,
                nik: finalData.nik,
                nomor_kk: finalData.nomorKK,
                tempat_lahir: finalData.tempatLahir,
                tanggal_lahir: finalData.tanggalLahir,
                jenis_kelamin: finalData.jenisKelamin,
                alamat: finalData.alamat,
                kondisi_fisik: finalData.kondisiFisik,
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
                dtsen_desil: finalData.dtsenDesil,
                sekolah_asal: finalData.sekolahAsal,
                bersedia_asrama: finalData.bersediaAsrama,
                sudah_pernyataan: finalData.sudahPernyataan,
                penghasilan: finalData.penghasilan,
                nominal_penghasilan: finalData.nominalPenghasilan,
                pengeluaran: finalData.pengeluaran,
                nominal_pengeluaran: finalData.nominalPengeluaran,
                pekerjaan_ayah: finalData.pekerjaanAyah,
                penjelasan_pekerjaan: finalData.penjelasanPekerjaan,
                pekerjaan_ibu: finalData.pekerjaanIbu,
                jumlah_tanggungan: finalData.jumlahTanggungan,
                status_tanah: finalData.statusTanah,
                status_rumah: finalData.statusRumah,
                luas_tanah: finalData.luasTanah,
                luas_rumah: finalData.luasRumah,
                sumber_penerangan: finalData.sumberPenerangan,
                id_listrik: finalData.idListrik,
                jenis_usaha: finalData.jenisUsahaId,
                produk_usaha: finalData.produkUsaha,
                foto_produk: await uploadFile("fotoProduk", formUsaha.fotoProduk),
                foto_siswa: fotoSiswaPath,
                foto_orang_tua: fotoOrangTuaPath,
                foto_rumah_depan: fotoRumahDepanPath,
                foto_rumah_dalam: fotoRumahDalamPath,
                foto_rumah_samping: fotoRumahSampingPath,
                surat_pernyataan: suratPernyataanPath,
                sktm: sktmPath,
                petugas: finalData.petugas,
                nama_petugas: finalData.namaPetugas,
                nomor_hp_petugas: finalData.nomorHpPetugas,
                lokasi: finalData.lokasi,
                catatan: finalData.catatan,
                bansos: Object.entries(finalData.bansos || {})
                    .filter(([_, value]) => value)
                    .map(([key]) => key.split("_").join(" "))
                    .join(", "),
            };

            // PERUBAHAN UTAMA DIMULAI DI SINI
            
            // 1. Generate PDF dan dapatkan datanya sebagai Blob
            const pdfBlob = await generateAssessmentPDF(mappedData);
            if (!pdfBlob) {
                throw new Error("Gagal membuat file PDF.");
            }

            // 2. Buat nama file unik
            const pdfFileName = `pdf/${Date.now()}_${mappedData.nik}.pdf`;
            console.log("PDF siap upload:", pdfFileName);

            // 3. Upload Blob PDF ke Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("uploads")
                .upload(pdfFileName, pdfBlob, {
                    contentType: "application/pdf",
                    upsert: true,
                });

            if (uploadError) {
                console.error("Gagal upload PDF:", uploadError);
                throw new Error("Gagal upload PDF: " + uploadError.message);
            }

            // 4. Ambil public URL untuk disimpan ke database
            const { data: publicUrlData } = supabase.storage
                .from("uploads")
                .getPublicUrl(pdfFileName);

            const publicUrl = publicUrlData.publicUrl;
            console.log("Public URL PDF:", publicUrl);

            // 5. Insert semua data (termasuk URL PDF) ke tabel
            const { error: dbError } = await supabase.from("tb_input").insert({
                ...mappedData,
                hasil_pdf: publicUrl,
            });

            if (dbError) {
                console.error("Gagal insert ke DB:", dbError);
                throw new Error("Gagal insert DB: " + dbError.message);
            }

            // 6. Tampilkan alert sukses dengan opsi download dari Blob yang sama
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil disimpan dan PDF telah di-upload!",
                showCancelButton: true,
                confirmButtonText: "Download Bukti",
                cancelButtonText: "Tutup",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Buat link download dari Blob yang sudah ada di memori
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(pdfBlob);
                    link.download = `pendaftaran_${mappedData.nik}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
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