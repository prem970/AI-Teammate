import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: "/login/customer" });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login/customer", "http://localhost:3000"));
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
