import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Pendaftaran Siswa Baru", // Ganti judulnya agar lebih relevan
    description: "Formulir Pendaftaran Siswa Baru Sekolah Rakyat",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            {/* Meskipun Next.js pintar, menambahkan <head> secara eksplisit 
              adalah praktik yang baik untuk kejelasan.
            */}
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
                    {children}
                </main>
            </body>
        </html>
    );
}