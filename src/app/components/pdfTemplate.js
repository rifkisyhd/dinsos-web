import jsPDF from "jspdf";

/**
 * @param {Object} data - Data hasil input form (snake_case).
 * @returns {Promise<Blob>} - Promise yang akan resolve dengan PDF sebagai Blob.
 */
export const generateAssessmentPDF = async (data) => {
  // Log data yang diterima untuk memastikan datanya tidak kosong
  console.log("PDF generation triggered with data:", data);

  const storageUrl = (path) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${path}`;
  };

  const loadImage = async (url) => {
    if (!url) return null;
    try {
      const response = await fetch(url);
      if (response.ok) return url;
      return null;
    } catch (error) {
      console.error("Image load error:", url, error);
      return null;
    }
  };

  const [
    fotoSiswaUrl,
    fotoRumahDepanUrl,
    fotoRumahSampingUrl,
    fotoRumahDalamUrl,
    fotoProdukUrl,
  ] = await Promise.all([
    loadImage(storageUrl(data.foto_siswa)),
    loadImage(storageUrl(data.foto_rumah_depan)),
    loadImage(storageUrl(data.foto_rumah_samping)),
    loadImage(storageUrl(data.foto_rumah_dalam)),
    loadImage(storageUrl(data.foto_produk)),
  ]);

  // Menggunakan struktur HTML dari kode Anda, termasuk style pada H2
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 15px; max-width: 800px;">
        <h2 style="text-align: center; font-size: 14px; margin: 0 100px 20px 0;">BUKTI PENDAFTARAN PESERTA DIDIK BARU<br/>SEKOLAH RAKYAT</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 130px; vertical-align: top;">
                        <div style="width: 120px; height: 160px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                            ${
                              fotoSiswaUrl
                                ? `<img src="${fotoSiswaUrl}" style="max-width: 100%; max-height: 100%;" />`
                                : "No Image"
                            }
                        </div>
                    </td>

                    <td style="width: 335px; vertical-align: top; padding: 0 10px;">
                        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                            <tr><td style="padding: 2.5px; width: 35%;">Nama</td><td style="padding: 2.5px;">: ${
                              data.nama_lengkap || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">NIK</td><td style="padding: 2.5px;">: ${
                              data.nik || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">No KK</td><td style="padding: 2.5px;">: ${
                              data.nomor_kk || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Tempat, Tgl Lahir</td><td style="padding: 2.5px;">: ${
                              data.tempat_lahir || "-"
                            }, ${data.tanggal_lahir || "-"}</td></tr>
                            <tr><td style="padding: 2.5px;">Jenis Kelamin</td><td style="padding: 2.5px;">: ${
                              data.jenis_kelamin || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Alamat</td><td style="padding: 2.5px;">: ${
                              data.alamat || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Agama</td><td style="padding: 2.5px;">: ${
                              data.agama || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Kondisi Fisik</td><td style="padding: 2.5px;">: ${
                              data.kondisi_fisik || "-"
                            }</td></tr>
                        </table>
                    </td>

                    <td style="width: 335px; vertical-align: top; padding: 0 10px;">
                         <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                            <tr><td style="padding: 2.5px; width: 45%;">Masuk DTSEN desil ke</td><td style="padding: 2.5px;">: ${
                              data.dtsen_desil || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Sekolah Asal</td><td style="padding: 2.5px;">: ${
                              data.sekolah_asal || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Bersedia di asrama</td><td style="padding: 2.5px;">: ${
                              data.bersedia_asrama || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Surat Pernyataan</td><td style="padding: 2.5px;">: ${
                              data.sudah_pernyataan || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Status Tanah</td><td style="padding: 2.5px;">: ${
                              data.status_tanah || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Status Rumah</td><td style="padding: 2.5px;">: ${
                              data.status_rumah || "-"
                            }</td></tr>
                            <tr><td style="padding: 2.5px;">Luas Tempat Tinggal</td><td style="padding: 2.5px;">: ${
                              data.luas_rumah ? data.luas_rumah + " M²" : "-"
                            }</td></tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 20px;">
             <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                       <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                           <b>Bansos Diterima:</b>
                           <div style="font-size: 10px; border: 1px solid #ccc; padding: 4px; margin-top: 4px; min-height: 20px;">${
                             data.bansos || "-"
                           }</div>
                           <br/>
                           <b>Galeri Foto Rumah:</b>
                           <div style="display: flex; gap: 5px; margin-top: 4px;">
                               <div style="width: 90px; height: 67.5px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${
                                 fotoRumahDepanUrl
                                   ? `<img src="${fotoRumahDepanUrl}" style="max-width: 100%; max-height: 100%;" />`
                                   : "Depan"
                               }</div>
                               <div style="width: 90px; height: 67.5px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${
                                 fotoRumahSampingUrl
                                   ? `<img src="${fotoRumahSampingUrl}" style="max-width: 100%; max-height: 100%;" />`
                                   : "Samping"
                               }</div>
                               <div style="width: 90px; height: 67.5px; border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size:9px;">${
                                 fotoRumahDalamUrl
                                   ? `<img src="${fotoRumahDalamUrl}" style="max-width: 100%; max-height: 100%;" />`
                                   : "Dalam"
                               }</div>
                           </div>
                           <br/>
                           <b>Foto Produk Usaha:</b>
                           <div style="width: 90px; height: 67.5px; border: 1px solid #ccc; background: #f0f0f0; margin-top: 4px; display: flex; align-items: center; justify-content: center; font-size:9px;">
                               ${
                                 fotoProdukUrl
                                   ? `<img src="${fotoProdukUrl}" style="max-width: 100%; max-height: 100%;" />`
                                   : "No Image"
                               }
                           </div>
                       </td>
                       <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                           <b>Catatan Petugas:</b>
                           <div style="font-size: 10px; border: 1px solid #ccc; padding: 4px; min-height: 80px; margin-top: 4px;">
                               ${data.catatan || "-"}
                           </div>
                           <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-top: 20px;">
                               <tr><td style="padding: 2.5px; width: 35%;">Petugas</td><td style="padding: 2.5px;">: ${
                                 data.nama_petugas || "-"
                               }</td></tr>
                               <tr><td style="padding: 2.5px;">No. HP Petugas</td><td style="padding: 2.5px;">: ${
                                 data.nomor_hp_petugas || "-"
                               }</td></tr>
                           </table>
                       </td>
                  </tr>
             </table>
        </div>
    </div>`;
  
  // Menggunakan logika fungsional saya untuk menghasilkan Blob
  return new Promise(async (resolve, reject) => {
    try {
      const container = document.createElement("div");
      container.style.width = "800px";
      container.innerHTML = html;
      document.body.appendChild(container);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
        hotfixes: ["px_scaling"],
      });

      const contentWidth = 800;
      const leftMargin = 45; 

      await pdf.html(container, {
        callback: function (doc) {
          document.body.removeChild(container);
          const blob = doc.output('blob');
          resolve(blob);
        },
        x: leftMargin,
        y: 15,
        width: contentWidth,
        windowWidth: contentWidth,
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};