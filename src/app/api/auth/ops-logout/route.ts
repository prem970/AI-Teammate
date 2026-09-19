import { NextResponse } from "next/server";
import { OPS_AUTH_COOKIE_NAME } from "@/lib/opsAuth";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: "/login/ops" });
  response.cookies.delete(OPS_AUTH_COOKIE_NAME);
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login/ops", "http://localhost:3000"));
  response.cookies.delete(OPS_AUTH_COOKIE_NAME);
  return response;
}
