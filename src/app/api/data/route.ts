import { NextRequest, NextResponse } from "next/server";
import {
  listOrders,
  listDevices,
  listCustomerEscalations,
  listOpsEscalations,
  listPolicies,
  listLeads,
  isCosmosLive,
} from "@/lib/cosmos/repository";
import { getCurrentCustomerSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");
  const customerIdParam = searchParams.get("customerId") || undefined;

  if (!isCosmosLive()) {
    return NextResponse.json(
      { success: false, dataOrigin: "unavailable", error: "Cosmos not configured", items: [] },
      { status: 503 }
    );
  }

  try {
    const session = await getCurrentCustomerSession();
    const merchantScoped = Boolean(session?.customerId);
    const customerId = merchantScoped ? session!.customerId : customerIdParam;

    switch (resource) {
      case "orders":
        return NextResponse.json({
          success: true,
          dataOrigin: "cosmos",
          items: await listOrders(customerId),
        });
      case "devices":
        return NextResponse.json({
          success: true,
          dataOrigin: "cosmos",
          items: await listDevices(customerId),
        });
      case "escalations":
        return NextResponse.json({
          success: true,
          dataOrigin: "cosmos",
          items: customerId
            ? await listCustomerEscalations(customerId)
            : await listOpsEscalations(),
        });
      case "policies":
        return NextResponse.json({
          success: true,
          dataOrigin: "cosmos",
          items: await listPolicies(),
        });
      case "leads":
        return NextResponse.json({
          success: true,
          dataOrigin: "cosmos",
          items: await listLeads(),
        });
      default:
        return NextResponse.json(
          { success: false, error: "Unknown resource. Use orders|devices|escalations|policies|leads" },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Query failed";
    return NextResponse.json({ success: false, error, items: [] }, { status: 500 });
  }
}
