import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;

    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/main", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|error-page).*)"],
}