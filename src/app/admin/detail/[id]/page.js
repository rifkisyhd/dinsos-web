"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// import { supabase } from "@/utils/supabase";
import { supabase } from "@/lib/supabaseClient";

export default function DetailPage({ params }) {
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

    const ImagePreview = ({ label, src }) => (
        <div>
            <p className="text-gray-600">{label}</p>
            <img
                src={src}
                alt={label}
                className="w-32 h-32 object-cover border rounded"
            />
        </div>
    );

    const FileLink = ({ label, url }) => (
        <div>
            <p className="text-gray-600">{label}</p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline">
                Lihat Dokumen
            </a>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
                    {data.foto_produk && (
                        <div>
                            <p className="text-gray-600">Foto Produk</p>
                            <img
                                src={data.foto_produk}
                                alt="Foto Produk"
                                className="w-32 h-32 object-cover border"
                            />
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">
                    Dokumen & Foto
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {data.foto_siswa && (
                        <ImagePreview
                            label="Foto Siswa"
                            src={data.foto_siswa}
                        />
                    )}
                    {data.foto_orang_tua && (
                        <ImagePreview
                            label="Foto Orang Tua"
                            src={data.foto_orang_tua}
                        />
                    )}
                    {data.foto_rumah_depan && (
                        <ImagePreview
                            label="Rumah Depan"
                            src={data.foto_rumah_depan}
                        />
                    )}
                    {data.foto_rumah_dalam && (
                        <ImagePreview
                            label="Rumah Dalam"
                            src={data.foto_rumah_dalam}
                        />
                    )}
                    {data.foto_rumah_samping && (
                        <ImagePreview
                            label="Rumah Samping"
                            src={data.foto_rumah_samping}
                        />
                    )}
                    {data.surat_pernyataan && (
                        <FileLink
                            label="Surat Pernyataan"
                            url={data.surat_pernyataan}
                        />
                    )}
                    {data.sktm && <FileLink label="SKTM" url={data.sktm} />}
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
