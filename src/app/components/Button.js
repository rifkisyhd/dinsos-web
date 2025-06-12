export default function Button({
    label,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = "",
}) {
    const baseStyles =
        "px-4 py-2 rounded font-medium transition-colors duration-200";
    const variants = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300",
        secondary:
            "bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300",
        success:
            "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className} disabled:cursor-not-allowed`}>
            {label}
        </button>
    );
}
