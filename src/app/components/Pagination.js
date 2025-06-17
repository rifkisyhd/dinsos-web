import React from "react";

export default function Pagination({
    page,
    totalPages,
    handlePageChange,
}) {
    return (
        <div className="flex justify-center items-center mt-6 space-x-4">
            <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                    page === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                Sebelumnya
            </button>
            <span className="text-gray-700">
                Halaman {page} dari {totalPages}
            </span>
            <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                    page === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                Selanjutnya
            </button>
        </div>
    );
}
