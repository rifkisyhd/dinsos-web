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
    const storageUrl = (path) => {
        if (!path) return "";
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${path}`;
    };

    // Siapkan URL gambar
    // (Dihandle langsung di Promise.all di bawah)

    // Helper untuk memuat gambar
    const loadImage = async (url) => {
        if (!url) return null;
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            return url;
        } catch (error) {
            return null;
        }
    };

    console.log("📸 Starting image loading...");
    // Tunggu semua gambar diverifikasi
    const [
        fotoSiswaUrl,
        fotoRumahDepanUrl,
        fotoRumahSampingUrl,
        fotoRumahDalamUrl,
    ] = await Promise.all([
        loadImage(storageUrl(data.foto_siswa)),
        loadImage(storageUrl(data.foto_rumah_depan)),
        loadImage(storageUrl(data.foto_rumah_dalam)),
        loadImage(storageUrl(data.foto_rumah_samping)),
    ]);

    console.log("📄 Images loaded, generating PDF...");
    console.log({
        fotoSiswa: !!fotoSiswaUrl,
        fotoRumahDepan: !!fotoRumahDepanUrl,
        fotoRumahSamping: !!fotoRumahSampingUrl,
        fotoRumahDalam: !!fotoRumahDalamUrl,
    });

    // Template HTML dengan gambar langsung
    const html = `
    <div style="font-family: Arial, sans-serif; padding:12px; max-width:800px;">
        <div style="display:flex; gap:12px;">
            <div style="flex:1;">
                ${
                    fotoSiswaUrl
                        ? `<img src="${fotoSiswaUrl}" 
                           style="max-width:120px; max-height:160px; display:block; border:1px solid #ccc;" />`
                        : `<div style="width:120px; height:160px; background:#f0f0f0; border:1px solid #ccc; display:flex; align-items:center; justify-content:center;">No Image</div>`
                }
                
                <!-- Data siswa -->
                <div style="margin-top:8px;">
                    <table style="width:100%; border-collapse:collapse; font-size:10px;">
                        <tr><td style="padding:2px;">Nama</td><td style="padding:2px;">: ${
                            data.nama || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">NIK</td><td style="padding:2px;">: ${
                            data.nik || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">No KK</td><td style="padding:2px;">: ${
                            data.no_kk || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Tempat, tanggal lahir</td><td style="padding:2px;">: ${
                            data.tempat_lahir || "-"
                        }, ${data.tanggal_lahir || "-"}</td></tr>
                        <tr><td style="padding:2px;">Jenis Kelamin</td>
    <td style="padding:2px;">: ${
        data?.jenisKelamin || data?.jenis_kelamin || data?.gender || "-"
    }</td></tr>
                        <tr><td style="padding:2px;">Alamat</td><td style="padding:2px;">: ${
                            data.alamat || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Agama</td><td style="padding:2px;">: ${
                            data.agama || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Fisik</td><td style="padding:2px;">: ${
                            data.fisik || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Masuk DTSEN desil ke</td><td style="padding:2px;">: ${
                            data.desil || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Sekolah Asal</td><td style="padding:2px;">: ${
                            data.sekolah_asal || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Bersedia tinggal di asrama</td><td style="padding:2px;">: ${
                            data.tinggal_asrama || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Tanda tangan surat pernyataan</td><td style="padding:2px;">: ${
                            data.surat_pernyataan ? "Ya" : "Tidak"
                        }</td></tr>
                    </table>
                </div>
            </div>
            
            <div style="flex:1;">
                <!-- Foto rumah -->
                <div style="display:flex; gap:4px; margin-bottom:8px;">
                    ${[
                        fotoRumahDepanUrl,
                        fotoRumahSampingUrl,
                        fotoRumahDalamUrl,
                    ]
                        .map((url) =>
                            url
                                ? `<img src="${url}" style="max-width:80px; max-height:60px; display:block; border:1px solid #ccc;" />`
                                : `<div style="width:80px; height:60px; background:#f0f0f0; border:1px solid #ccc; display:flex; align-items:center; justify-content:center; font-size:9px;">No Image</div>`,
                        )
                        .join("")}
                </div>

                <!-- Data rumah dan petugas -->
                <div style="font-size:10px;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr><td style="padding:2px;">Status Kepemilikan Tanah</td><td style="padding:2px;">: ${
                            data.status_tanah || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Status Kepemilikan Rumah</td><td style="padding:2px;">: ${
                            data.status_rumah || "-"
                        }</td></tr>
                        <tr><td style="padding:2px;">Luas Tempat Tinggal</td><td style="padding:2px;">: ${
                            data.luas_rumah || "-"
                        } M²</td></tr>
                        <tr><td style="padding:2px;">Bansos yang Diterima</td><td style="padding:2px;">: ${
                            data.bansos || "-"
                        }</td></tr>
                    </table>
                </div>

                <div style="margin-top:8px; font-size:10px;">
                    <b>Catatan Petugas:</b>
                    <div style="border:1px solid #ccc; padding:4px; min-height:40px;">
                        ${data.catatan || "-"}
                    </div>
                </div>

                <div style="margin-top:12px; font-size:10px;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td style="padding:2px;">Nama petugas</td><td style="padding:2px;">: ${
                                data.nama_petugas || "-"
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding:2px;">No HP</td><td style="padding:2px;">: ${
                                data.nomor_hp_petugas || "-"
                            }</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>`;

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
        hotfixes: ["px_scaling"],
    });

    await pdf.html(container, {
        callback: function (doc) {
            console.log("✅ PDF generation complete");
            doc.save("pendaftaran-sekolah-rakyat.pdf");
            document.body.removeChild(container);
        },
        x: 10,
        y: 10,
        width: 800,
        windowWidth: 800,
        html2canvas: {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: true,
            imageTimeout: 2000,
            onclone: function (clonedDoc) {
                console.log("🔄 Cloning document for PDF...");
                const images = clonedDoc.getElementsByTagName("img");
                console.log(`📸 Processing ${images.length} images`);
                for (let img of images) {
                    console.log("Image source:", img.src);
                    img.style.maxWidth = "100%";
                    img.style.maxHeight = "100%";
                }
            },
        },
    });
};
