"use client";
import FormInput from "@/app/components/FormInput";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoadingScreen from "../../../components/LoadingScreen";
import Swal from "sweetalert2";
import Select from "react-select";

// [TIDAK BERUBAH] - Definisi fields tetap sama
const fields = [
    { name: "nama_lengkap", label: "Nama Lengkap", type: "text", required: true },
    { name: "nik", label: "NIK", type: "text", required: true },
    { name: "nomor_kk", label: "Nomor KK", type: "text" },
    { name: "tempat_lahir", label: "Tempat Lahir", type: "text" },
    { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date" },
    { name: "jenis_kelamin", label: "Jenis Kelamin", type: "select", optionTable: "jenis_kelamin" },
    { name: "agama", label: "Agama", type: "select", optionTable: "agama" },
    { name: "kondisi_fisik", label: "Kondisi Fisik", type: "select", optionTable: "kondisi_fisik" },
    { name: "alamat", label: "Alamat", type: "textarea" }, // Ubah ke textarea untuk input lebih panjang
    { name: "rt", label: "RT", type: "text" },
    { name: "rw", label: "RW", type: "text" },
    { name: "ayah", label: "Nama Ayah", type: "text" },
    { name: "ibu", label: "Nama Ibu", type: "text" },
    { name: "pekerjaan_ayah", label: "Pekerjaan Ayah", type: "select", optionTable: "pekerjaan" },
    { name: "pekerjaan_ibu", label: "Pekerjaan Ibu", type: "select", optionTable: "pekerjaan" },
    { name: "penjelasan_pekerjaan", label: "Deskripsi Pekerjaan Orang Tua", type: "textarea" },
    { name: "wali", label: "Wali (jika ada)", type: "text" },
    { name: "penghasilan", label: "Penghasilan Keluarga / Bulan", type: "select", optionTable: "penghasilan" },
    { name: "nominal_penghasilan", label: "Nominal Penghasilan", type: "number" },
    { name: "pengeluaran", label: "Pengeluaran Keluarga / Bulan", type: "select", optionTable: "penghasilan" },
    { name: "nominal_pengeluaran", label: "Nominal Pengeluaran", type: "number" },
    { name: "jumlah_tanggungan", label: "Jumlah Tanggungan", type: "number" },
    { name: "status_tanah", label: "Status Tanah", type: "text" },
    { name: "status_rumah", label: "Status Rumah", type: "text" },
    { name: "luas_tanah", label: "Luas Tanah (m²)", type: "text" },
    { name: "luas_rumah", label: "Luas Rumah (m²)", type: "text" },
    { name: "sumber_penerangan", label: "Sumber Penerangan", type: "text" },
    { name: "id_listrik", label: "ID Listrik", type: "text" },
    { name: "jenis_usaha", label: "Jenis Usaha Keluarga", type: "text" },
    { name: "produk_usaha", label: "Produk Usaha", type: "text" },
    { name: "petugas", label: "Petugas Survei", type: "text" },
    { name: "nama_petugas", label: "Nama Petugas", type: "text" },
    { name: "nomor_hp_petugas", label: "Nomor HP Petugas", type: "text" },
    { name: "lokasi", label: "Lokasi Survei", type: "text" },
    { name: "catatan", label: "Catatan Tambahan", type: "textarea" },
];

// [TIDAK BERUBAH] - Struktur data form tetap menjadi otak dari layout
const formStructure = [
    {
        title: "Informasi Pribadi Siswa",
        fields: ["nama_lengkap", "nik", "nomor_kk", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "agama", "kondisi_fisik"],
    },
    {
        title: "Alamat Tempat Tinggal",
        fields: ["provinsi", "kabupaten", "kecamatan", "kelurahan", "rt", "rw", "alamat"],
    },
    {
        title: "Informasi Keluarga",
        fields: ["ayah", "ibu", "pekerjaan_ayah", "pekerjaan_ibu", "penjelasan_pekerjaan", "wali"],
    },
    {
        title: "Kondisi Ekonomi",
        fields: ["penghasilan", "nominal_penghasilan", "pengeluaran", "nominal_pengeluaran", "jumlah_tanggungan"],
    },
     {
        title: "Aset & Properti",
        fields: ["status_tanah", "status_rumah", "luas_tanah", "luas_rumah", "sumber_penerangan", "id_listrik"],
    },
    {
        title: "Informasi Usaha (jika ada)",
        fields: ["jenis_usaha", "produk_usaha"],
    },
    {
        title: "Data Survei Petugas",
        fields: ["petugas", "nama_petugas", "nomor_hp_petugas", "lokasi", "catatan"],
    },
];

export default function EditPage() {
    // [TIDAK BERUBAH] - Semua state dan logika fetching data tetap sama
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [options, setOptions] = useState({});
    const [loadingOptions, setLoadingOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [kabupatenList, setKabupatenList] = useState([]);
    const [kecamatanList, setKecamatanList] = useState([]);
    const [kelurahanList, setKelurahanList] = useState([]);
    const [isLoadingWilayah, setIsLoadingWilayah] = useState({
        kabupaten: false,
        kecamatan: false,
        kelurahan: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from("tb_input").select("*").eq("id", params.id).single();
            if (error) setError(error.message);
            setData(data);
            setIsLoading(false);
        };
        if (params.id) fetchData();
    }, [params.id]);

    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.type === "select" && field.optionTable) {
                setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));
                const { data: optData } = await supabase.from(field.optionTable).select("*");
                setOptions((prev) => ({
                    ...prev,
                    [field.name]: optData ? optData.map((opt) => ({ value: opt.nama || opt.value || opt.id, label: opt.nama || opt.label || opt.value })) : [],
                }));
                setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
            }
        });
    }, []);
    
    useEffect(() => {
        const fetchKabupaten = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kabupaten: true }));
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_WILAYAH}/regencies/35.json`);
                const dataKab = await response.json();
                setKabupatenList(dataKab.map((item) => ({ value: item.id, label: item.name })));
            } catch (error) { console.error("Failed to fetch kabupaten:", error); } 
            finally { setIsLoadingWilayah((prev) => ({ ...prev, kabupaten: false })); }
        };
        fetchKabupaten();
    }, []);

    useEffect(() => {
        if (!data?.kabupaten) return;
        const selectedKab = kabupatenList.find((item) => item.label === data.kabupaten);
        if (!selectedKab) return;
        const fetchKecamatan = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kecamatan: true }));
            setKecamatanList([]); setKelurahanList([]);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_WILAYAH}/districts/${selectedKab.value}.json`);
                const dataKec = await response.json();
                setKecamatanList(dataKec.map((item) => ({ value: item.id, label: item.name })));
            } catch (error) { console.error("Failed to fetch kecamatan:", error); }
            finally { setIsLoadingWilayah((prev) => ({ ...prev, kecamatan: false })); }
        };
        fetchKecamatan();
    }, [data?.kabupaten, kabupatenList]);

    useEffect(() => {
        if (!data?.kecamatan) return;
        const selectedKec = kecamatanList.find((item) => item.label === data.kecamatan);
        if (!selectedKec) return;
        const fetchKelurahan = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kelurahan: true }));
            setKelurahanList([]);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_WILAYAH}/villages/${selectedKec.value}.json`);
                const dataKel = await response.json();
                setKelurahanList(dataKel.map((item) => ({ value: item.id, label: item.name })));
            } catch (error) { console.error("Failed to fetch kelurahan:", error); }
            finally { setIsLoadingWilayah((prev) => ({ ...prev, kelurahan: false })); }
        };
        fetchKelurahan();
    }, [data?.kecamatan, kecamatanList]);

    const handleChange = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "Konfirmasi",
            text: "Anda yakin ingin menyimpan perubahan ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed) return;
        setIsSaving(true);
        setError("");
        const { error: updateError } = await supabase.from("tb_input").update(data).eq("id", params.id);
        setIsSaving(false);
        if (updateError) {
            setError(updateError.message);
            Swal.fire("Gagal", `Data gagal disimpan: ${updateError.message}`, "error");
        } else {
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data telah berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });
            router.push(`/admin/detail/${params.id}`);
        }
    };

    if (isLoading) return <LoadingScreen />;
    if (!data) return <div className="p-6 text-center">Data tidak ditemukan atau gagal dimuat.</div>;

    // [DIREFACTOR] - JSX diubah untuk layout minimalis
    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Data Siswa</h1>
                    <p className="text-gray-500 mt-1">Perbarui informasi calon siswa di bawah ini.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {formStructure.map((section) => {
                            // Cek apakah seksi ini harus ditampilkan
                            const hasFieldsToRender = section.fields.some(fieldName => {
                                // Field wilayah ditangani secara khusus
                                if (["provinsi", "kabupaten", "kecamatan", "kelurahan"].includes(fieldName)) return true;
                                return fields.find(f => f.name === fieldName);
                            });

                            if (!hasFieldsToRender) return null;

                            return (
                                <div key={section.title}>
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b">
                                        {section.title}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        {section.fields.map((fieldName) => {
                                            const field = fields.find((f) => f.name === fieldName);
                                            const isWideField = field?.type === 'textarea';
                                            
                                            // Dinamis mengatur span kolom
                                            const containerClassName = isWideField ? "md:col-span-2" : "col-span-1";
                                            
                                            // Handler untuk kasus-kasus khusus (wilayah)
                                            if (fieldName === "provinsi") return (
                                                <div key="provinsi" className={containerClassName}>
                                                    <label className="block text-sm font-medium mb-1">Provinsi</label>
                                                    <Select value={{ value: "35", label: "JAWA TIMUR" }} isDisabled={true} />
                                                </div>
                                            );
                                            if (fieldName === "kabupaten") return (
                                                <div key="kabupaten" className={containerClassName}>
                                                    <label className="block text-sm font-medium mb-1">Kabupaten / Kota</label>
                                                    <Select options={kabupatenList} value={kabupatenList.find(item => item.label === data.kabupaten) || null} onChange={(s) => { handleChange("kabupaten", s ? s.label : ""); handleChange("kecamatan", ""); handleChange("kelurahan", ""); }} isLoading={isLoadingWilayah.kabupaten} placeholder={isLoadingWilayah.kabupaten ? "Memuat..." : "Pilih..."} isClearable />
                                                </div>
                                            );
                                            if (fieldName === "kecamatan") return (
                                                <div key="kecamatan" className={containerClassName}>
                                                    <label className="block text-sm font-medium mb-1">Kecamatan</label>
                                                    <Select options={kecamatanList} value={kecamatanList.find(item => item.label === data.kecamatan) || null} onChange={(s) => { handleChange("kecamatan", s ? s.label : ""); handleChange("kelurahan", ""); }} isLoading={isLoadingWilayah.kecamatan} placeholder={isLoadingWilayah.kecamatan ? "Memuat..." : "Pilih..."} isDisabled={!data.kabupaten || isLoadingWilayah.kecamatan} isClearable />
                                                </div>
                                            );
                                            if (fieldName === "kelurahan") return (
                                                <div key="kelurahan" className={containerClassName}>
                                                    <label className="block text-sm font-medium mb-1">Kelurahan / Desa</label>
                                                    <Select options={kelurahanList} value={kelurahanList.find(item => item.label === data.kelurahan) || null} onChange={(s) => handleChange("kelurahan", s ? s.label : "")} isLoading={isLoadingWilayah.kelurahan} placeholder={isLoadingWilayah.kelurahan ? "Memuat..." : "Pilih..."} isDisabled={!data.kecamatan || isLoadingWilayah.kelurahan} isClearable />
                                                </div>
                                            );

                                            if (!field) return null;

                                            return (
                                                <div key={field.name} className={containerClassName}>
                                                    <FormInput field={field} value={data[field.name]} onChange={handleChange} options={options[field.name] || []} isLoading={loadingOptions[field.name]} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {error && <div className="mt-6 text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</div>}

                    <div className="flex gap-4 pt-8 mt-8 border-t">
                        <button type="submit" disabled={isSaving || isLoading} className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}   