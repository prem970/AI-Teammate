import { NextRequest, NextResponse } from "next/server";
import { getUsersStore, addUserToStore, updateUserRoleInStore } from "@/lib/adminMockData";
import { UserRole } from "@/lib/adminTypes";

export async function GET() {
  const users = getUsersStore();
  return NextResponse.json({ success: true, users });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, department } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const newUser = addUserToStore({
      name,
      email,
      role: role as UserRole,
      department: department || "General Operations",
      status: "active",
      mfaEnabled: true,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required." },
        { status: 400 }
      );
    }

    const success = updateUserRoleInStore(userId, role as UserRole);
    if (!success) {
      return NextResponse.json({ error: `User ${userId} not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${userId} role updated to ${role}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
