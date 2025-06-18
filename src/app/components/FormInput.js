import Select from "react-select";

export default function FormInput({
    field,
    value,
    onChange,
    options = [],
    isLoading,
}) {
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
