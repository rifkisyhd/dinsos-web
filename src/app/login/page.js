"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // login/page.jsx
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1: Ambil email berdasarkan username
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("email")
                .eq("username", username)
                .single();

            if (userError || !userData)
                throw new Error("Username tidak ditemukan");

            // Step 2: Login pakai email dan password
            const { data, error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: userData.email,
                    password,
                });

            if (loginError) throw loginError;

            console.log("Login sukses, menunggu session...");

            // Step 3: Tunggu session muncul beneran (polling kecil)
            let retries = 5;
            while (retries > 0) {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session) {
                    console.log("Session siap, redirect ke /admin");
                    router.push("/admin");
                    return;
                }

                await new Promise((res) => setTimeout(res, 300)); // delay 300ms
                retries--;
            }

            throw new Error("Gagal mendapatkan session");
        } catch (err) {
            console.error(err);
            setError("Username atau password salah!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login Admin
                </h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-600"
                        }`}>
                        {loading ? "Masuk..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
