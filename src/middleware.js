import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log("Session dari middleware:", session);

    // Middleware route protect logic
    if (req.nextUrl.pathname.startsWith("/admin") && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};
