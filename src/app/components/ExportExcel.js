"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportExcel({
    data = [],
    fileName = "data.xlsx",
    filterMonth = "",
}) {
    const handleExport = () => {
        const filteredData = data.filter((item) => {
            if (!filterMonth) return true;
            const itemMonth = new Date(item.created_at)
                .toISOString()
                .slice(5, 7);
            return itemMonth === filterMonth;
        });

        const exportData = filteredData.map((item) => ({
            Tanggal: new Date(item.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            Nama: item.nama_lengkap,
            NIK: item.nik,
            "No. KK": item.nomor_kk,
            Alamat: item.alamat,
            "Jenis Kelamin": item.jenis_kelamin,
            "Tempat Lahir": item.tempat_lahir,
            "Tanggal Lahir": new Date(item.tanggal_lahir).toLocaleDateString(
                "id-ID",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                },
            ),
            Agama: item.agama,
            "Kondisi Fisik": item.kondisi_fisik,
            "Sekolah Asal": item.sekolah_asal,
            "DTSEN desil": item.dtsen_desil,
            "Bersedia tinggal di asrama": item.bersedia_asrama,
            "Sudah Menandatangani Surat Pernyataan": item.sudah_pernyataan,
            "Nama Ayah": item.ayah,
            "Nama Ibu": item.ibu,
            "Nama Wali": item.wali,
            "Pekerjaan Ayah": item.pekerjaan_ayah,
            "Pekerjaan Ibu": item.pekerjaan_ibu,
            "Penjelasan Pekerjaan": item.penjelasan_pekerjaan,
            "Jumlah Tanggungan": item.jumlah_tanggungan,
            "Penghasilan Per Bulan": item.nominal_penghasilan,
            "Pengeluaran Per Bulan": item.nominal_pengeluaran,
            "Status Tanah": item.status_tanah,
            "Status Rumah": item.status_rumah,
            "Luas Tanah": item.luas_tanah,
            "Luas Rumah": item.luas_rumah,
            "Sumber Penerangan": item.sumber_penerangan,
            "Id Listrik": item.id_listrik,
            "Jenis Usaha": item.jenis_usaha,
            "Produk Usaha": item.produk_usaha,
            "Bantuan Sosial": item.bansos,
            Catatan: item.catatan,
            Petugas: item.petugas,
            "Nama Petugas": item.nama_petugas,
            "Nomor HP Petugas": item.nomor_hp_petugas,
            Lokasi: item.lokasi,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(blob, fileName);
    };

    return (
        <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 ml-4">
            Export Excel
        </button>
    );
}
