import React from "react";

export default function FilterBar({
    searchKeyword,
    setSearchKeyword,
    selectedYear,
    setSelectedYear,
    availableYears,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    selectedKabupaten,
    setSelectedKabupaten,
    kabupatenList,
    selectedPetugas,
    setSelectedPetugas,
    petugasList,
    searchInput,
    setSearchInput,
    setPage,
    onResetFilter,
}) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Cari Nama atau NIK
                    </label>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchKeyword(searchInput);
                                setPage(1); // reset pagination ke page awal
                            }
                        }}
                        placeholder="Cari nama atau NIK..."
                        className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Tahun */}
                <div>
                    <label
                        htmlFor="filter-tahun"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Tahun
                    </label>
                    <select
                        id="filter-tahun"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="">Semua</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bulan */}
                <div>
                    <label
                        htmlFor="filter-bulan"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Bulan
                    </label>
                    <select
                        id="filter-bulan"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="">Semua</option>
                        {availableMonths.map((month) => (
                            <option key={month} value={month}>
                                {new Date(
                                    `2023-${month}-01`,
                                ).toLocaleDateString("id-ID", {
                                    month: "long",
                                })}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kabupaten */}
                <div>
                    <label
                        htmlFor="filter-kabupaten"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Kabupaten
                    </label>
                    <select
                        id="filter-kabupaten"
                        value={selectedKabupaten}
                        onChange={(e) => setSelectedKabupaten(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="">Semua</option>
                        {kabupatenList.map((nama, idx) => (
                            <option key={idx} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Petugas */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="filter-petugas"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Petugas
                    </label>
                    <select
                        id="filter-petugas"
                        value={selectedPetugas}
                        onChange={(e) => setSelectedPetugas(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="">Semua</option>
                        {petugasList.map((nama, idx) => (
                            <option key={idx} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={onResetFilter}
                    className="text-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                    Reset Filter
                </button>
            </div>
        </div>
    );
}
