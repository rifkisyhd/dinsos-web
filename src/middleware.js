import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log("Session dari middleware:", session);

    // Belum login, tapi akses /admin → lempar ke /login
    if (req.nextUrl.pathname.startsWith("/admin") && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Sudah login, tapi akses /login → lempar ke /admin
    if (req.nextUrl.pathname === "/login" && session) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Sudah login, tapi akses / → lempar ke /admin
    if (req.nextUrl.pathname === "/" && session) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/admin/:path*", "/login", "/"],
};
