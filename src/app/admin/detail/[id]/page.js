"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPublicUrl } from "@/lib/getPublicUrl";
import Image from "next/image";

// import { supabase } from "@/utils/supabase";
import LoadingScreen from "../../../components/LoadingScreen";
import { supabase } from "@/lib/supabaseClient";

export default function DetailPage() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const { data: detail, error } = await supabase
                    .from("tb_input")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;
                setData(detail);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [params.id]);

    const Detail = ({ label, value }) => (
        <div>
            <p className="text-gray-600">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );

    const ImagePreview = ({ label, src }) => {
        const [error, setError] = useState(false);

        return (
            <div>
                <p className="text-gray-600">{label}</p>
                {src && !error ? (
                    <img
                        src={src}
                        alt={label}
                        className="w-32 h-32 object-cover border rounded"
                        onError={() => setError(true)}
                    />
                ) : (
                    <div className="w-32 h-32 flex text-center items-center justify-center border rounded bg-gray-100 text-gray-400 text-xl">
                        Tidak Ada Gambar
                    </div>
                )}
            </div>
        );
    };

    const FileLink = ({ label, url }) => (
        <div>
            <p className="text-gray-600">{label}</p>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline">
                    Lihat Dokumen
                </a>
            ) : (
                <span className="text-gray-400 text-xl">Tidak Ada Dokumen</span>
            )}
        </div>
    );

    if (isLoading) {
        return <LoadingScreen />;
    }
    const FotoSiswa = getPublicUrl(data.foto_siswa);
    const FotoOrangTua = getPublicUrl(data.foto_orang_tua);
    const FotoRumahDepan = getPublicUrl(data.foto_rumah_depan);
    const FotoRumahDalam = getPublicUrl(data.foto_rumah_dalam);
    const FotoRumahSamping = getPublicUrl(data.foto_rumah_samping);
    const SuratPernyataan = data.surat_pernyataan
        ? getPublicUrl(data.surat_pernyataan)
        : null;
    const SKTM = data.sktm ? getPublicUrl(data.sktm) : null;
    const FotoProduk = data.foto_produk ? getPublicUrl(data.foto_produk) : null;
    const HasilPDF = data.hasil_pdf ? getPublicUrl(data.hasil_pdf) : null;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Detail Pendaftaran</h1>
                <button
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Kembali
                </button>
            </div>

            <div className="bg-white shadow-md rounded p-6 space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">
                    Data Pribadi
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Nama Lengkap" value={data.nama_lengkap} />
                    <Detail label="NIK" value={data.nik} />
                    <Detail label="Nomor KK" value={data.nomor_kk} />
                    <Detail label="Tempat Lahir" value={data.tempat_lahir} />
                    <Detail label="Tanggal Lahir" value={data.tanggal_lahir} />
                    <Detail label="Jenis Kelamin" value={data.jenis_kelamin} />
                    <Detail label="Alamat" value={data.alamat} />
                    <Detail label="Provinsi" value={data.provinsi} />
                    <Detail label="Kabupaten" value={data.kabupaten} />
                    <Detail label="Kecamatan" value={data.kecamatan} />
                    <Detail label="Kelurahan" value={data.kelurahan} />
                    <Detail label="RT/RW" value={`${data.rt}/${data.rw}`} />
                    <Detail label="Agama" value={data.agama} />
                    <Detail label="Kondisi Fisik" value={data.kondisi_fisik} />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">
                    Data Keluarga
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Ayah" value={data.ayah} />
                    <Detail label="Ibu" value={data.ibu} />
                    <Detail label="Wali" value={data.wali} />
                    <Detail label="Sekolah Asal" value={data.sekolah_asal} />
                    <Detail label="DTSEN Desil" value={data.dtsen_desil} />
                    <Detail
                        label="Bersedia Asrama"
                        value={data.bersedia_asrama ? "Ya" : "Tidak"}
                    />
                    <Detail
                        label="Sudah Pernyataan"
                        value={data.sudah_pernyataan ? "Ya" : "Tidak"}
                    />
                    <Detail label="Bansos" value={data.bansos} />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">
                    Data Ekonomi
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Penghasilan" value={data.penghasilan} />
                    <Detail
                        label="Nominal Penghasilan"
                        value={data.nominal_penghasilan}
                    />
                    <Detail label="Pengeluaran" value={data.pengeluaran} />
                    <Detail
                        label="Nominal Pengeluaran"
                        value={data.nominal_pengeluaran}
                    />
                    <Detail
                        label="Pekerjaan Ayah"
                        value={data.pekerjaan_ayah}
                    />
                    <Detail label="Pekerjaan Ibu" value={data.pekerjaan_ibu} />
                    <Detail
                        label="Penjelasan Pekerjaan"
                        value={data.penjelasan_pekerjaan}
                    />
                    <Detail
                        label="Jumlah Tanggungan"
                        value={data.jumlah_tanggungan}
                    />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">
                    Tempat Tinggal
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Status Tanah" value={data.status_tanah} />
                    <Detail label="Status Rumah" value={data.status_rumah} />
                    <Detail label="Luas Tanah" value={data.luas_tanah} />
                    <Detail label="Luas Rumah" value={data.luas_rumah} />
                    <Detail
                        label="Sumber Penerangan"
                        value={data.sumber_penerangan}
                    />
                    <Detail label="ID Listrik" value={data.id_listrik} />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">Usaha</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Jenis Usaha" value={data.jenis_usaha} />
                    <Detail label="Produk Usaha" value={data.produk_usaha} />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">
                    Dokumen & Foto
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <ImagePreview label="Foto Siswa" src={FotoSiswa} />
                    <ImagePreview label="Foto Orang Tua" src={FotoOrangTua} />
                    <ImagePreview label="Rumah Depan" src={FotoRumahDepan} />
                    <ImagePreview label="Rumah Dalam" src={FotoRumahDalam} />
                    <ImagePreview
                        label="Rumah Samping"
                        src={FotoRumahSamping}
                    />
                    <ImagePreview label="Foto Produk" src={FotoProduk} />
                    <FileLink label="Surat Pernyataan" url={SuratPernyataan} />
                    <FileLink label="SKTM" url={SKTM} />
                    <FileLink label="Hasil PDF" url={HasilPDF} />
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">Petugas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Detail label="Petugas" value={data.petugas} />
                    <Detail label="Nama Petugas" value={data.nama_petugas} />
                    <Detail
                        label="Nomor HP Petugas"
                        value={data.nomor_hp_petugas}
                    />
                    <Detail label="Lokasi" value={data.lokasi} />
                    <Detail label="Catatan" value={data.catatan} />
                </div>
            </div>
        </div>
    );
}
