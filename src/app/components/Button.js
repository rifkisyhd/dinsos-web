export default function Button({
    label,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary", // Prop baru untuk varian warna
}) {
    // Kelas dasar yang berlaku untuk semua tombol
    const baseClasses =
        "w-full px-5 py-2.5 text-center font-medium text-white rounded-lg focus:outline-none focus:ring-4 transition-colors duration-300 ease-in-out";

    // Daftar varian warna yang bisa dipilih
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300", // Biru (default)
        secondary: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-300", // Abu-abu
        success: "bg-green-600 hover:bg-green-700 focus:ring-green-300", // Hijau
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-300", // Merah (untuk hapus)
    };

    // Kelas khusus untuk kondisi disabled
    const disabledClasses = "bg-gray-400 hover:bg-gray-400 cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseClasses} 
                ${disabled ? disabledClasses : variants[variant]}
            `}
        >
            {label}
        </button>
    );
}