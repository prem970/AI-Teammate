import { NextRequest, NextResponse } from "next/server";
import { OPS_AUTH_COOKIE_NAME, OpsSession } from "@/lib/opsAuth";
import { MOCK_EMPLOYEES } from "@/lib/opsMockData";
import { EmployeeRole, EmployeeUser } from "@/lib/opsTypes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role = "support", email } = body;

    let selectedEmployee: EmployeeUser | undefined = MOCK_EMPLOYEES[role as EmployeeRole];
    if (!selectedEmployee && email) {
      selectedEmployee = Object.values(MOCK_EMPLOYEES).find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase()
      );
    }
    const finalEmployee: EmployeeUser = selectedEmployee || MOCK_EMPLOYEES.support;

    const session: OpsSession = {
      userId: finalEmployee.id,
      name: finalEmployee.name,
      email: finalEmployee.email,
      role: finalEmployee.role,
      department: finalEmployee.department,
      badgeId: finalEmployee.badgeId,
      authenticatedAt: new Date().toISOString(),
    };

    const redirectTo =
      finalEmployee.role === "sales_ops" ? "/ops/sales/pipeline" : "/ops";

    const response = NextResponse.json({
      success: true,
      session,
      redirectTo,
    });

    response.cookies.set({
      name: OPS_AUTH_COOKIE_NAME,
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
      { success: false, error: "Invalid ops authentication request" },
      { status: 400 }
    );
  }
}
