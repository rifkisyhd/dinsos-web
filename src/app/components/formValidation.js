import Swal from "sweetalert2";

export const requiredFields = {
    petugas: ["petugas", "namaPetugas", "nomorHpPetugas", "lokasi"],
    siswa: [
        "namaLengkap",
        "nik",
        "nomorKK",
        "tempatLahir",
        "tanggalLahir",
        "jenisKelamin",
        "agama",
        "sekolahAsal",
    ],
    tempatTinggal: [
        "provinsi",
        "kabupaten",
        "kecamatan",
        "kelurahan",
        "rw",
        "rt",
        "alamat",
    ],
    keluarga: ["ayah", "ibu"],
    aset: [
        "statusTanah",
        "statusRumah",
        "luasTanah",
        "luasRumah",
        "sumberPenerangan",
    ],
    infoTambahan: ["ukuranBaju", "ukuranCelana", "ukuranSepatu"],
    dokumen: [
        "fotoSiswa",
        "fotoOrangTua",
        "fotoRumahDepan",
        "fotoRumahDalam",
        "fotoRumahSamping",
        "suratPernyataan",
    ],
};

export function validateForm(form, fields) {
    return fields.every(
        (field) =>
            form[field] !== undefined &&
            form[field] !== null &&
            form[field] !== "" &&
            !(typeof form[field] === "string" && form[field].trim() === ""),
    );
}

// Fungsi validasi + alert SweetAlert
export function validateFormWithAlert(
    form,
    fields,
    alertText = "Semua field wajib diisi!",
) {
    const isValid = validateForm(form, fields);
    if (!isValid) {
        Swal.fire({
            icon: "warning",
            title: "Lengkapi Data!",
            text: alertText,
        });
    }
    return isValid;
}
