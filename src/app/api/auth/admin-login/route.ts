import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME, AdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email = "admin.super@company.mock", name = "Platform Administrator" } = body;

    const session: AdminSession = {
      userId: "USR-001",
      name,
      email,
      role: "admin",
      authenticatedAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      session,
      redirectTo: "/admin",
    });

    response.cookies.set({
      name: ADMIN_AUTH_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(session)),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid admin authentication payload" },
      { status: 400 }
    );
  }
}
