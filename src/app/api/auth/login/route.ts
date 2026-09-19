import { NextRequest, NextResponse } from "next/server";
import { findCustomerByEmail, findCustomerById, isCosmosLive } from "@/lib/cosmos/repository";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const customerIdHint = String(body.customerId || "").trim();

    if (!email && !customerIdHint) {
      return NextResponse.json({ success: false, error: "Email or customerId required" }, { status: 400 });
    }

    if (!isCosmosLive()) {
      return NextResponse.json(
        {
          success: false,
          error: "Azure Cosmos is not configured. Cannot authenticate against original merchant records.",
        },
        { status: 503 }
      );
    }

    let customer =
      (email ? await findCustomerByEmail(email) : null) ||
      (customerIdHint ? await findCustomerById(customerIdHint) : null);

    // Allow login by customerId pasted in email field (demo convenience)
    if (!customer && email.toUpperCase().startsWith("CUST-")) {
      customer = await findCustomerById(email.toUpperCase());
    }

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Merchant not found in Cosmos customers container" },
        { status: 401 }
      );
    }

    const session = {
      customerId: customer.id,
      role: "customer" as const,
      name: customer.name,
      email: customer.email,
      authenticatedAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
      dataOrigin: "cosmos",
    });

    response.cookies.set(AUTH_COOKIE_NAME, encodeURIComponent(JSON.stringify(session)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
