"use client";
import FormInput from "@/app/components/FormInput";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoadingScreen from "../../../components/LoadingScreen";
import Swal from "sweetalert2";
import Select from "react-select";

const fields = [
    {
        name: "nama_lengkap",
        label: "Nama Lengkap",
        type: "text",
        required: true,
    },
    { name: "nik", label: "NIK", type: "text", required: true },
    { name: "nomor_kk", label: "Nomor KK", type: "text" },
    { name: "tempat_lahir", label: "Tempat Lahir", type: "text" },
    { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date" },
    {
        name: "jenis_kelamin",
        label: "Jenis Kelamin",
        type: "select",
        optionTable: "jenis_kelamin",
    }, // select dari tabel
    { name: "agama", label: "Agama", type: "select", optionTable: "agama" }, // select dari tabel
    {
        name: "kondisi_fisik",
        label: "Kondisi Fisik",
        type: "select",
        optionTable: "kondisi_fisik",
    }, // select dari tabel
    { name: "alamat", label: "Alamat", type: "text" },
    {
        name: "provinsi",
        label: "Provinsi",
        type: "select",
        optionTable: "provinsi",
    }, // jika di screens pakai select
    {
        name: "kabupaten",
        label: "Kabupaten",
        type: "select",
        optionTable: "kabupaten",
    }, // jika di screens pakai select
    {
        name: "kecamatan",
        label: "Kecamatan",
        type: "select",
        optionTable: "kecamatan",
    }, // jika di screens pakai select
    {
        name: "kelurahan",
        label: "Kelurahan",
        type: "select",
        optionTable: "kelurahan",
    }, // jika di screens pakai select
    { name: "rt", label: "RT", type: "text" },
    { name: "rw", label: "RW", type: "text" },
    { name: "bansos", label: "Bansos", type: "text" },
    { name: "ayah", label: "Ayah", type: "text" },
    { name: "ibu", label: "Ibu", type: "text" },
    {
        name: "pekerjaan_ayah",
        label: "Pekerjaan Ayah sesuai KTP",
        type: "select",
        optionTable: "pekerjaan",
    },
    {
        name: "pekerjaan_ibu",
        label: "Pekerjaan Ibu sesuai KTP",
        type: "select",
        optionTable: "pekerjaan",
    },
    {
        name: "penjelasan_pekerjaan",
        label: "Penjelasan Pekerjaan Ayah dan Ibu",
        type: "textarea",
    },
    {
        name: "wali",
        label: "Wali Calon Siswa (Jika tidak memiliki orang tua)",
        type: "text",
    },
    {
        name: "penghasilan",
        label: "Penghasilan Keluarga Perbulan",
        type: "select",
        optionTable: "penghasilan",
    },
    {
        name: "nominal_penghasilan",
        label: "Nominal Penghasilan Keluarga",
        type: "number",
    },
    {
        name: "pengeluaran",
        label: "Pengeluaran Keluarga Perbulan",
        type: "select",
        optionTable: "penghasilan",
    },
    {
        name: "nominal_pengeluaran",
        label: "Nominal Pengeluaran Keluarga",
        type: "number",
    },
    { name: "jumlah_tanggungan", label: "Jumlah Tanggungan", type: "number" },
    { name: "status_tanah", label: "Status Tanah", type: "text" },
    { name: "status_rumah", label: "Status Rumah", type: "text" },
    { name: "luas_tanah", label: "Luas Tanah", type: "text" },
    { name: "luas_rumah", label: "Luas Rumah", type: "text" },
    { name: "sumber_penerangan", label: "Sumber Penerangan", type: "text" },
    { name: "id_listrik", label: "ID Listrik", type: "text" },
    { name: "jenis_usaha", label: "Jenis Usaha", type: "text" },
    { name: "produk_usaha", label: "Produk Usaha", type: "text" },
    { name: "petugas", label: "Petugas", type: "text" },
    { name: "nama_petugas", label: "Nama Petugas", type: "text" },
    { name: "nomor_hp_petugas", label: "Nomor HP Petugas", type: "text" },
    { name: "lokasi", label: "Lokasi", type: "text" },
    { name: "catatan", label: "Catatan", type: "text" },
];

export default function EditPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState({});
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

    // Fetch data untuk di-edit
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("tb_input")
                .select("*")
                .eq("id", params.id)
                .single();
            if (error) setError(error.message);
            setData(data);
            setIsLoading(false);
        };
        fetchData();
    }, [params.id]);

    // Fetch options select dari database
    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.type === "select" && field.optionTable) {
                setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));
                const { data: optData } = await supabase
                    .from(field.optionTable)
                    .select("*");
                setOptions((prev) => ({
                    ...prev,
                    [field.name]: optData
                        ? optData.map((opt) => ({
                              value: opt.nama || opt.value || opt.id,
                              label: opt.nama || opt.label || opt.value,
                          }))
                        : [],
                }));
                setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
            }
        });
    }, []);

    // Fetch kabupaten saat mount
    useEffect(() => {
        const fetchKabupaten = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kabupaten: true }));
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_WILAYAH}/regencies/35.json`,
                );
                const dataKab = await response.json();
                setKabupatenList(
                    dataKab.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                );
            } catch (error) {
                // handle error
            } finally {
                setIsLoadingWilayah((prev) => ({ ...prev, kabupaten: false }));
            }
        };
        fetchKabupaten();
    }, []);

    // Fetch kecamatan jika kabupaten berubah
    useEffect(() => {
        if (!data.kabupaten) return;
        const selectedKab = kabupatenList.find(
            (item) => item.label === data.kabupaten,
        );
        if (!selectedKab) return;
        const fetchKecamatan = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kecamatan: true }));
            setKecamatanList([]);
            setKelurahanList([]);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_WILAYAH}/districts/${selectedKab.value}.json`,
                );
                const dataKec = await response.json();
                setKecamatanList(
                    dataKec.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                );
            } catch (error) {
                // handle error
            } finally {
                setIsLoadingWilayah((prev) => ({ ...prev, kecamatan: false }));
            }
        };
        fetchKecamatan();
    }, [data.kabupaten, kabupatenList]);

    // Fetch kelurahan jika kecamatan berubah
    useEffect(() => {
        if (!data.kecamatan) return;
        const selectedKec = kecamatanList.find(
            (item) => item.label === data.kecamatan,
        );
        if (!selectedKec) return;
        const fetchKelurahan = async () => {
            setIsLoadingWilayah((prev) => ({ ...prev, kelurahan: true }));
            setKelurahanList([]);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_WILAYAH}/villages/${selectedKec.value}.json`,
                );
                const dataKel = await response.json();
                setKelurahanList(
                    dataKel.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                );
            } catch (error) {
                // handle error
            } finally {
                setIsLoadingWilayah((prev) => ({ ...prev, kelurahan: false }));
            }
        };
        fetchKelurahan();
    }, [data.kecamatan, kecamatanList]);

    const handleChange = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin menyimpan perubahan data?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        setIsSaving(true);
        setError("");
        const { error } = await supabase
            .from("tb_input")
            .update(data)
            .eq("id", params.id);
        setIsSaving(false);
        if (error) {
            setError(error.message);
        } else {
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil disimpan!",
                timer: 1500,
                showConfirmButton: false,
            });
            router.push(`/admin/detail/${params.id}`);
        }
    };

    if (isLoading) return <LoadingScreen />;
    if (!data) return <div className="p-6">Data tidak ditemukan.</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Data</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Row 1: Data Diri & Tempat Tinggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blok 1 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Data Diri Calon Siswa
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    [
                                        "nama_lengkap",
                                        "nik",
                                        "nomor_kk",
                                        "tempat_lahir",
                                        "tanggal_lahir",
                                        "jenis_kelamin",
                                        "agama",
                                        "kondisi_fisik",
                                    ].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Blok 2 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Tempat Tinggal Siswa
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Provinsi */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Provinsi
                                </label>
                                <Select
                                    options={[
                                        { value: "35", label: "Jawa Timur" },
                                    ]}
                                    value={{ value: "35", label: "Jawa Timur" }}
                                    isDisabled={true}
                                    className="mb-4"
                                />
                            </div>
                            {/* Kabupaten */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Kabupaten / Kota
                                </label>
                                <Select
                                    options={kabupatenList}
                                    value={
                                        kabupatenList.find(
                                            (item) =>
                                                item.label === data.kabupaten,
                                        ) || null
                                    }
                                    onChange={(selected) => {
                                        handleChange(
                                            "kabupaten",
                                            selected ? selected.label : "",
                                        );
                                        handleChange("kecamatan", "");
                                        handleChange("kelurahan", "");
                                    }}
                                    isLoading={isLoadingWilayah.kabupaten}
                                    placeholder={
                                        isLoadingWilayah.kabupaten
                                            ? "Memuat..."
                                            : "Pilih Kabupaten / Kota"
                                    }
                                    className="mb-4"
                                    isClearable
                                />
                            </div>
                            {/* Kecamatan */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Kecamatan
                                </label>
                                <Select
                                    options={kecamatanList}
                                    value={
                                        kecamatanList.find(
                                            (item) =>
                                                item.label === data.kecamatan,
                                        ) || null
                                    }
                                    onChange={(selected) => {
                                        handleChange(
                                            "kecamatan",
                                            selected ? selected.label : "",
                                        );
                                        handleChange("kelurahan", "");
                                    }}
                                    isLoading={isLoadingWilayah.kecamatan}
                                    placeholder={
                                        isLoadingWilayah.kecamatan
                                            ? "Memuat..."
                                            : "Pilih Kecamatan"
                                    }
                                    isDisabled={
                                        !data.kabupaten ||
                                        isLoadingWilayah.kecamatan
                                    }
                                    className="mb-4"
                                    isClearable
                                />
                            </div>
                            {/* Kelurahan */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Kelurahan / Desa
                                </label>
                                <Select
                                    options={kelurahanList}
                                    value={
                                        kelurahanList.find(
                                            (item) =>
                                                item.label === data.kelurahan,
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        handleChange(
                                            "kelurahan",
                                            selected ? selected.label : "",
                                        )
                                    }
                                    isLoading={isLoadingWilayah.kelurahan}
                                    placeholder={
                                        isLoadingWilayah.kelurahan
                                            ? "Memuat..."
                                            : "Pilih Kelurahan / Desa"
                                    }
                                    isDisabled={
                                        !data.kecamatan ||
                                        isLoadingWilayah.kelurahan
                                    }
                                    className="mb-4"
                                    isClearable
                                />
                            </div>
                            {fields
                                .filter((f) =>
                                    ["alamat", "rt", "rw"].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Row 2: Data Keluarga & Data Ekonomi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blok 3 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Data Keluarga
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    [
                                        "ayah",
                                        "ibu",
                                        "pekerjaan_ayah",
                                        "pekerjaan_ibu",
                                        "penjelasan_pekerjaan",
                                        "wali",
                                    ].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Blok 4 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Data Ekonomi
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    [
                                        "penghasilan",
                                        "nominal_penghasilan",
                                        "pengeluaran",
                                        "nominal_pengeluaran",
                                        "jumlah_tanggungan",
                                    ].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Row 3: Aset Tempat Tinggal & Data Usaha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blok 5 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Aset Tempat Tinggal
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    [
                                        "status_tanah",
                                        "status_rumah",
                                        "luas_tanah",
                                        "luas_rumah",
                                        "sumber_penerangan",
                                        "id_listrik",
                                    ].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Blok 6 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Data Usaha
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    ["jenis_usaha", "produk_usaha"].includes(
                                        f.name,
                                    ),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Row 4: Data Petugas (sendiri) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                            Data Petugas
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fields
                                .filter((f) =>
                                    [
                                        "petugas",
                                        "nama_petugas",
                                        "nomor_hp_petugas",
                                        "lokasi",
                                        "catatan",
                                    ].includes(f.name),
                                )
                                .map((field) => (
                                    <FormInput
                                        key={field.name}
                                        field={field}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        options={options[field.name] || []}
                                        isLoading={loadingOptions[field.name]}
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Kosongkan kolom kanan jika hanya 1 blok */}
                    <div />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2 mt-8">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}
