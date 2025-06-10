// src/components/FileInput.js

"use client";

import { useRef } from "react";

export default function FileInput({ 
    label, 
    fileType, 
    fileName, 
    onChange,
    name 
}) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-gray-400">({fileType})</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={fileName || ""}
                    placeholder="Pilih berkas ..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-32"
                />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="absolute top-0 right-0 h-full px-4 text-sm font-medium text-white bg-blue-600 rounded-r-lg border border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                    Pilih berkas ...
                </button>
                <input
                    type="file"
                    name={name}
                    ref={fileInputRef}
                    onChange={onChange}
                    className="hidden"
                    accept={fileType === 'PDF' ? '.pdf' : 'image/jpeg, image/png'}
                />
            </div>
        </div>
    );
}