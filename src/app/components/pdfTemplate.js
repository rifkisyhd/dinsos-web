import jsPDF from "jspdf";

/**
 * @param {Object} data - Data hasil input form (snake_case).
 * @param {Object} options - { bucket: string }
 */
export const generateAssessmentPDF = async (data, options = {}) => {
    // Ambil projectId dari environment variable
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
    const { bucket = "uploads" } = options;

    // Helper untuk URL gambar Supabase Storage
    const storageUrl = (path) =>
        path
            ? `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${path}`
            : "";

    // Siapkan URL gambar
    const fotoSiswaUrl = storageUrl(data.foto_siswa);
    const fotoRumahDepanUrl = storageUrl(data.foto_rumah_depan);
    const fotoRumahDalamUrl = storageUrl(data.foto_rumah_dalam);
    const fotoRumahSampingUrl = storageUrl(data.foto_rumah_samping);

    // Template HTML
    const html = `
    <div style="font-family: Arial, sans-serif; font-size:12px; width:900px; padding:24px;">
        <div style="display:flex; gap:16px;">
            <div style="flex:1;">
                <img src="${fotoSiswaUrl}" style="width:140px; height:180px; object-fit:cover; border:1px solid #ccc; margin-bottom:8px;" />
                <table style="width:100%; border-collapse:collapse;">
                    <tr><td>Nama</td><td>: ${data.nama || ""}</td></tr>
                    <tr><td>NIK</td><td>: ${data.nik || ""}</td></tr>
                    <tr><td>No KK</td><td>: ${data.no_kk || ""}</td></tr>
                    <tr><td>Tempat, tanggal lahir</td><td>: ${
                        data.tempat_lahir || ""
                    }, ${data.tanggal_lahir || ""}</td></tr>
                    <tr><td>Jenis Kelamin</td><td>: ${
                        data.jenis_kelamin || ""
                    }</td></tr>
                    <tr><td>Alamat</td><td>: ${data.alamat || ""}</td></tr>
                    <tr><td>Agama</td><td>: ${data.agama || ""}</td></tr>
                    <tr><td>Fisik</td><td>: ${data.fisik || ""}</td></tr>
                    <tr><td>Masuk DTSEN desil ke</td><td>: ${
                        data.desil || ""
                    }</td></tr>
                    <tr><td>Sekolah Asal</td><td>: ${
                        data.sekolah_asal || ""
                    }</td></tr>
                    <tr><td>Bersedia tinggal di asrama</td><td>: ${
                        data.tinggal_asrama || ""
                    }</td></tr>
                    <tr><td>Sudah tanda tangan surat pernyataan</td><td>: ${
                        data.surat_pernyataan ? "Ya" : "Tidak"
                    }</td></tr>
                </table>
                <table style="width:100%; border-collapse:collapse; margin-top:8px;">
                    <tr>
                        <td>Nama Ayah</td><td>: ${data.nama_ayah || ""}</td>
                        <td>Nama Ibu</td><td>: ${data.nama_ibu || ""}</td>
                    </tr>
                    <tr>
                        <td>Pekerjaan Ayah</td><td>: ${
                            data.pekerjaan_ayah || ""
                        }</td>
                        <td>Pekerjaan Ibu</td><td>: ${
                            data.pekerjaan_ibu || ""
                        }</td>
                    </tr>
                    <tr>
                        <td>Jumlah Tanggungan</td><td colspan="3">: ${
                            data.jumlah_tanggungan || ""
                        }</td>
                    </tr>
                    <tr>
                        <td>Penghasilan Perbulan</td><td colspan="3">: ${
                            data.nominal_penghasilan || ""
                        }</td>
                    </tr>
                </table>
            </div>
            <div style="flex:1;">
                <div style="display:flex; gap:4px; margin-bottom:8px;">
                    <img src="${fotoRumahDepanUrl}" style="width:90px; height:70px; object-fit:cover; border:1px solid #ccc;" />
                    <img src="${fotoRumahSampingUrl}" style="width:90px; height:70px; object-fit:cover; border:1px solid #ccc;" />
                    <img src="${fotoRumahDalamUrl}" style="width:90px; height:70px; object-fit:cover; border:1px solid #ccc;" />
                </div>
                <table style="width:100%; border-collapse:collapse;">
                    <tr><td>Status Kepemilikan Tanah</td><td>: ${
                        data.status_tanah || ""
                    }</td></tr>
                    <tr><td>Status Kepemilikan Rumah</td><td>: ${
                        data.status_rumah || ""
                    }</td></tr>
                    <tr><td>Luas Tempat Tinggal</td><td>: ${
                        data.luas_rumah || ""
                    } M²</td></tr>
                    <tr><td>Bansos yang Diterima</td><td>: ${
                        data.bansos || ""
                    }</td></tr>
                </table>
                <div style="margin-top:8px;">
                    <b>Catatan Petugas:</b>
                    <div style="border:1px solid #ccc; padding:4px; min-height:40px;">
                        ${data.catatan || ""}
                    </div>
                </div>
                <div style="margin-top:12px;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td>Nama petugas</td><td>: ${
                                data.nama_petugas || ""
                            }</td>
                        </tr>
                        <tr>
                            <td>No HP</td><td>: ${
                                data.nomor_hp_petugas || ""
                            }</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;

    // Render HTML ke PDF
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
    });

    await pdf.html(container, {
        callback: function (doc) {
            doc.save("pendaftaran-sekolah-rakyat.pdf");
            document.body.removeChild(container);
        },
        x: 10,
        y: 10,
        html2canvas: { scale: 0.8 },
    });
};
