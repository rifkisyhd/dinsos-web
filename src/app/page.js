"use client";
import { useState, useEffect } from "react";
import FormPetugas from "./screens/FormPetugas";
import FormDataSiswa from "./screens/FormDataSiswa";
import FormTempatTinggal from "./screens/FormTempatTinggal";
import FormDataKeluarga from "./screens/FormDataKeluarga";
import FormAset from "./screens/FormAset";
import FormDataUsaha from './screens/FormDataUsaha';
import FormInfoTambahan from "./screens/FormInfoTambahan";
import FormDokumen from "./screens/FormDokumen";
import FormCatatan from "./screens/FormCatatan";

export default function Page() {
    const [step, setStep] = useState(1); 


    return (
        <>
                {step === 1 && <FormPetugas setStep={setStep} />}
                {step === 2 && <FormDataSiswa setStep={setStep} />}
                {step === 3 && <FormTempatTinggal setStep={setStep} />}
                {step === 4 && <FormDataKeluarga setStep={setStep} />}
                {step === 5 && <FormAset setStep={setStep} />}
                {step === 6 && <FormDataUsaha setStep={setStep} />}
                {step === 7 && <FormInfoTambahan setStep={setStep} />}
                {step === 8 && <FormDokumen setStep={setStep} />}
                {step === 9 && <FormCatatan setStep={setStep} />}
        </>
    );
}   