"use client";

import { useState } from "react";
import FormDataSiswa from "./screens/FormDataSiswa";
import FormTempatTinggal from "./screens/FormTempatTinggal";
import FormDataKeluarga from "./screens/FormDataKeluarga";
import FormAset from './screens/FormAset';
import FormDataUsaha from './screens/FormDataUsaha';

export default function Page() {
    const [step, setStep] = useState(1); // State untuk mengatur langkah form

    // Hapus div pembungkus dan kelas-kelasnya.
    // Cukup gunakan React Fragment (<>...</>) karena layout
    // sudah diatur sepenuhnya oleh layout.js.
    return (
        <>
            {step === 1 && <FormDataSiswa setStep={setStep} />}
            {step === 2 && <FormTempatTinggal setStep={setStep} />}
            {step === 3 && <FormDataKeluarga setStep={setStep} />}
            {step === 4 && <FormAset setStep={setStep} />}
            {step === 5 && <FormDataUsaha setStep={setStep} />}
        </>
    );
}   