
export default function Button({ label, onClick, type = "button" }) {
    return (
        <button
            type={type} // Menggunakan prop 'type' agar fleksibel (bisa "button" atau "submit")
            onClick={onClick}
            className="px-5 py-2.5 text-center font-medium text-white bg-blue-600 rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 
                       transition-colors duration-300 ease-in-out"
        >
            {label}
        </button>
    );
}

