export default function Button({ label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            {label}
        </button>
    );
}
