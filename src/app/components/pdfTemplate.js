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
        fotoProdukUrl,
    ] = await Promise.all([
        loadImage(storageUrl(data.foto_siswa)),
        loadImage(storageUrl(data.foto_rumah_depan)),
        loadImage(storageUrl(data.foto_rumah_dalam)),
        loadImage(storageUrl(data.foto_rumah_samping)),
        loadImage(storageUrl(data.foto_produk)),
    ]);

    console.log("📄 Images loaded, generating PDF...");

    // Template HTML (tidak ada perubahan di sini)
    const html = `
    <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 15px; max-width: 800px;">
        <h2 style="text-align: center; font-size: 14px; margin-bottom: 20px;">BUKTI PENDAFTARAN PESERTA DIDIK BARU<br/>SEKOLAH RAKYAT</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                        <div style="width: 120px; height: 160px; border: 1px solid #ccc; background: #f0f0f0; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                            ${fotoSiswaUrl ? `<img src="${fotoSiswaUrl}" style="max-width: 100%; max-height: 100%;" />` : 'No Image'}
                        </div>
                        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                            <tr><td style="padding: 2px; width: 40%;">Nama</td><td style="padding: 2px;">: ${data.nama_lengkap || "-"}</td></tr>
                            <tr><td style="padding: 2px;">NIK</td><td style="padding: 2px;">: ${data.nik || "-"}</td></tr>
                            <tr><td style="padding: 2px;">No KK</td><td style="padding: 2px;">: ${data.nomor_kk || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Tempat, Tgl Lahir</td><td style="padding: 2px;">: ${data.tempat_lahir || "-"}, ${data.tanggal_lahir || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Jenis Kelamin</td><td style="padding: 2px;">: ${data.jenis_kelamin || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Alamat</td><td style="padding: 2px;">: ${data.alamat || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Agama</td><td style="padding: 2px;">: ${data.agama || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Kondisi Fisik</td><td style="padding: 2px;">: ${data.kondisi_fisik || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Masuk DTSEN desil ke</td><td style="padding: 2px;">: ${data.dtsen_desil || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Sekolah Asal</td><td style="padding: 2px;">: ${data.sekolah_asal || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Bersedia di asrama</td><td style="padding: 2px;">: ${data.bersedia_asrama || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Surat Pernyataan</td><td style="padding: 2px;">: ${data.sudah_pernyataan || "-"}</td></tr>
                        </table>
                    </td>

                    <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                            <div style="width: 80px; height: 60px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${fotoRumahDepanUrl ? `<img src="${fotoRumahDepanUrl}" style="max-width: 100%; max-height: 100%;" />` : 'Rumah Depan'}</div>
                            <div style="width: 80px; height: 60px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${fotoRumahSampingUrl ? `<img src="${fotoRumahSampingUrl}" style="max-width: 100%; max-height: 100%;" />` : 'Rumah Samping'}</div>
                            <div style="width: 80px; height: 60px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${fotoRumahDalamUrl ? `<img src="${fotoRumahDalamUrl}" style="max-width: 100%; max-height: 100%;" />` : 'Rumah Dalam'}</div>
                        </div>
                        <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 10px;">
                            <tr><td style="padding: 2px; width: 40%;">Status Tanah</td><td style="padding: 2px;">: ${data.status_tanah || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Status Rumah</td><td style="padding: 2px;">: ${data.status_rumah || "-"}</td></tr>
                            <tr><td style="padding: 2px;">Luas Tempat Tinggal</td><td style="padding: 2px;">: ${data.luas_rumah ? data.luas_rumah + ' M²' : "-"}</td></tr>
                            <tr><td style="padding: 2px;">Bansos Diterima</td><td style="padding: 2px;">: ${data.bansos || "-"}</td></tr>
                        </table>
                        <div style="width: 80px; height: 60px; border: 1px solid #ccc; background: #f0f0f0; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; font-size:9px;">
                            ${fotoProdukUrl ? `<img src="${fotoProdukUrl}" style="max-width: 100%; max-height: 100%;" />` : 'No Product Image'}
                        </div>
                        <div style="font-size: 10px; margin-bottom: 10px;">
                            <b>Catatan Petugas:</b>
                            <div style="border: 1px solid #ccc; padding: 4px; min-height: 40px; margin-top: 4px;">
                                ${data.catatan || "-"}
                            </div>
                        </div>
                        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                            <tr><td style="padding: 2px; width: 40%;">Petugas</td><td style="padding: 2px;">: ${data.nama_petugas || "-"}</td></tr>
                            <tr><td style="padding: 2px;">No. HP Petugas</td><td style="padding: 2px;">: ${data.nomor_hp_petugas || "-"}</td></tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`;

    const container = document.createElement("div");
    // Penting: set lebar container agar konsisten dengan parameter 'width' di pdf.html()
    container.style.width = '800px'; 
    container.innerHTML = html;
    document.body.appendChild(container);

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
        hotfixes: ["px_scaling"],
    });

    // --- PERUBAHAN UNTUK MEMBUAT KONTEN DI TENGAH ---
    const contentWidth = 800; // Lebar konten HTML Anda
    const pageWidth = pdf.internal.pageSize.getWidth();
    const centeredX = (pageWidth - contentWidth) / 2;
    // --- AKHIR PERUBAHAN ---

    await pdf.html(container, {
        callback: function (doc) {
            console.log("✅ PDF generation complete");
            doc.save("pendaftaran-sekolah-rakyat.pdf");
            document.body.removeChild(container);
        },
        // Gunakan nilai yang sudah dihitung untuk menempatkan konten di tengah
        x: centeredX,
        y: 15, // Beri sedikit jarak dari atas
        width: contentWidth, // Gunakan variabel untuk konsistensi
        windowWidth: contentWidth, // Gunakan variabel untuk konsistensi
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