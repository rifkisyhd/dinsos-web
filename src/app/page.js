"use client";

import { useState } from "react";
import FormDataSiswa from "./screens/FormDataSiswa";
import FormTempatTinggal from "./screens/FormTempatTinggal";
import FormDataKeluarga from "./screens/FormDataKeluarga";

export default function Page() {
    const [step, setStep] = useState(1); // State untuk mengatur langkah form

    return (
        <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
            {step === 1 && <FormDataSiswa setStep={setStep} />}
            {step === 2 && <FormTempatTinggal setStep={setStep} />}
            {step === 3 && <FormDataKeluarga setStep={setStep} />}
        </div>
    );
}
