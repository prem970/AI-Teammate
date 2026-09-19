import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, parseSessionCookie } from "@/lib/auth";
import { OPS_AUTH_COOKIE_NAME, parseOpsSessionCookie } from "@/lib/opsAuth";
import { ADMIN_AUTH_COOKIE_NAME, parseAdminSessionCookie } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /customer routes
  if (pathname.startsWith("/customer")) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = parseSessionCookie(sessionCookie);

    if (!session || session.role !== "customer") {
      const loginUrl = new URL("/login/customer", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /ops routes
  if (pathname.startsWith("/ops")) {
    const sessionCookie = request.cookies.get(OPS_AUTH_COOKIE_NAME)?.value;
    const session = parseOpsSessionCookie(sessionCookie);

    if (!session || !["support", "sales_ops", "policy_owner"].includes(session.role)) {
      const loginUrl = new URL("/login/ops", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
    const session = parseAdminSessionCookie(sessionCookie);

    if (!session || session.role !== "admin") {
      const loginUrl = new URL("/login/admin", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/ops/:path*", "/admin/:path*"],
};
