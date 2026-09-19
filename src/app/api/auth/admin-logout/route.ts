import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: "/login/admin" });
  response.cookies.delete(ADMIN_AUTH_COOKIE_NAME);
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login/admin", "http://localhost:3000"));
  response.cookies.delete(ADMIN_AUTH_COOKIE_NAME);
  return response;
}
