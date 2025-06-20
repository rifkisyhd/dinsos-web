import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Fungsi untuk membuat PDF placeholder sebagai pengganti file yang 404
async function createPlaceholderPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    // Ambil font untuk teks
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Tambahkan teks peringatan di tengah halaman
    page.drawText("File PDF tidak ditemukan", {
        x: 180,
        y: 430,
        size: 16,
        font,
        color: rgb(0.8, 0, 0), // Warna merah
    });

    page.drawText("Data ini mungkin belum memiliki PDF atau telah dihapus", {
        x: 120,
        y: 400,
        size: 12,
        font,
        color: rgb(0.6, 0.6, 0.6), // Warna abu-abu
    });

    return pdfDoc.save();
}

export async function POST(request) {
    try {
        const { pdfUrls } = await request.json();

        if (!pdfUrls || pdfUrls.length === 0) {
            return NextResponse.json(
                { error: "Tidak ada URL PDF yang dikirim" },
                { status: 400 },
            );
        }

        // Buat dokumen PDF baru
        const mergedPdf = await PDFDocument.create();
        let successCount = 0;
        let placeholderCount = 0;
        let failedUrls = [];

        // Gabungkan semua PDF
        for (const url of pdfUrls) {
            try {
                const response = await fetch(url);

                // Jika file tidak ditemukan (404), gunakan placeholder
                if (response.status === 404) {
                    console.log(
                        `File tidak ditemukan, menggunakan placeholder: ${url}`,
                    );

                    // Buat PDF placeholder
                    const placeholderBytes = await createPlaceholderPDF();

                    // Load PDF placeholder dan tambahkan ke merged PDF
                    const placeholderPdf = await PDFDocument.load(
                        placeholderBytes,
                    );
                    const copiedPages = await mergedPdf.copyPages(
                        placeholderPdf,
                        placeholderPdf.getPageIndices(),
                    );
                    copiedPages.forEach((page) => mergedPdf.addPage(page));

                    placeholderCount++;
                    continue;
                }

                // Jika ada error selain 404
                if (!response.ok) {
                    console.error(
                        `Error fetching PDF ${url}: ${response.status} ${response.statusText}`,
                    );
                    failedUrls.push(url);
                    continue;
                }

                const pdfBytes = await response.arrayBuffer();
                if (!pdfBytes || pdfBytes.byteLength === 0) {
                    console.error(`PDF empty: ${url}`);
                    failedUrls.push(url);
                    continue;
                }

                const pdf = await PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices(),
                );
                pages.forEach((page) => mergedPdf.addPage(page));
                successCount++;
            } catch (err) {
                console.error(`Error processing PDF ${url}:`, err);
                failedUrls.push(url);
            }
        }

        // Jika tidak ada yang berhasil dan tidak ada placeholder
        if (successCount === 0 && placeholderCount === 0) {
            return NextResponse.json(
                { error: "Semua PDF gagal diproses" },
                { status: 500 },
            );
        }

        const mergedBytes = await mergedPdf.save();

        return new NextResponse(mergedBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="gabungan.pdf"',
                "X-Success-Count": successCount,
                "X-Placeholder-Count": placeholderCount,
                "X-Failed-Count": failedUrls.length,
            },
        });
    } catch (error) {
        console.error("Error merging PDFs:", error);
        return NextResponse.json(
            { error: error.message || "Failed to merge PDFs" },
            { status: 500 },
        );
    }
}
