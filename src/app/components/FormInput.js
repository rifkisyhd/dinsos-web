import Select from "react-select";

export default function FormInput({
    field,
    value,
    onChange,
    options = [],
    isLoading,
}) {
    // Tambahkan support untuk checkbox-group
    if (field.type === "checkbox-group") {
        const selected = Array.isArray(value)
            ? value
            : (value || "")
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean);

        const handleCheckbox = (val) => {
            let updated = [...selected];
            if (updated.includes(val)) {
                updated = updated.filter((v) => v !== val);
            } else {
                updated.push(val);
            }
            onChange(field.name, updated.join(","));
        };

        return (
            <div>
                <label className="block text-sm font-medium mb-1">
                    {field.label}
                </label>
                <div className="flex flex-wrap gap-3">
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.value)}
                                onChange={() => handleCheckbox(opt.value)}
                                className="accent-blue-600"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    if (field.type === "select") {
        return (
            <div>
                <label className="block text-sm font-medium mb-1">
                    {field.label}
                </label>
                <Select
                    name={field.name}
                    value={options.find((opt) => opt.value === value) || null}
                    onChange={(opt) =>
                        onChange(field.name, opt ? opt.value : "")
                    }
                    options={options}
                    isLoading={isLoading}
                    placeholder={
                        isLoading ? "Memuat..." : `Pilih ${field.label}`
                    }
                    className="mb-4"
                    isClearable
                />
            </div>
        );
    }
    return (
        <div>
            <label className="block text-sm font-medium mb-1">
                {field.label}
            </label>
            <input
                type={field.type}
                name={field.name}
                value={value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="border px-3 py-2 rounded w-full"
                required={field.required}
            />
        </div>
    );
}
