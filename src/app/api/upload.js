import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
);

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { jenisUsahaId, produkUsaha, file } = req.body;

        try {
            // Upload gambar ke Supabase Storage
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("uploads")
                    .upload(`images/${Date.now()}_${file.name}`, file, {
                        contentType: file.type,
                    });

            if (uploadError) throw uploadError;

            const fotoUrl = uploadData.path;

            // Simpan data ke tabel tb_input
            const { data: insertData, error: insertError } = await supabase
                .from("tb_input")
                .insert({
                    jenis_usaha_id: jenisUsahaId,
                    produk_usaha: produkUsaha,
                    foto_produk: fotoUrl,
                });

            if (insertError) throw insertError;

            res.status(200).json({
                message: "Data berhasil disimpan",
                data: insertData,
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan",
                error: error.message,
            });
        }
    } else {
        res.status(405).json({ message: "Method tidak diizinkan" });
    }
}
