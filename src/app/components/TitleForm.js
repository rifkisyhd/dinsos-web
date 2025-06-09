export default function TitleForm({ title, subtitle, blok }) {
    return (
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                PENDAFTARAN PESERTA DIDIK BARU SEKOLAH RAKYAT
            </h2>
            <p className="text-center text-gray-500 mb-8">
                TAHUN AJARAN 2025-2026
            </p>

            <p className="text-lg text-start font-semibold text-blue-600 mb-6 border-b pb-2">
              {blok}
            </p>
        </div>
    );
}
