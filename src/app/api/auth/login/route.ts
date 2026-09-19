import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, CustomerSession } from "@/lib/auth";
import { MOCK_CUSTOMERS } from "@/lib/mockData";

import { Customer } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, customerId } = body;

    // Pick customer by explicit customerId or match email, default to CUST-10291
    let matchedCustomer: Customer | undefined = customerId ? MOCK_CUSTOMERS[customerId] : undefined;
    if (!matchedCustomer && email) {
      matchedCustomer = Object.values(MOCK_CUSTOMERS).find(
        (c) => c.email.toLowerCase() === email.toLowerCase()
      );
    }
    const finalCustomer: Customer = matchedCustomer || MOCK_CUSTOMERS["CUST-10291"];

    const session: CustomerSession = {
      customerId: finalCustomer.id,
      role: "customer",
      name: finalCustomer.name,
      email: finalCustomer.email,
      authenticatedAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      session,
      redirectTo: "/customer",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(session)),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid login payload" },
      { status: 400 }
    );
  }
}
