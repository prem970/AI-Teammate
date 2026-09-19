import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const mcpUrl = (process.env.MCP_BASE_URL || "").replace(/\/$/, "");
  const startTime = Date.now();

  if (!mcpUrl) {
    return NextResponse.json(
      { success: false, status: "MISSING_CONFIG", error: "MCP_BASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    // Streamable MCP often returns 400/406 on bare GET — reachable is enough
    const upstream = await fetch(mcpUrl, {
      method: "GET",
      headers: { Accept: "application/json, text/event-stream" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      status: upstream.status < 500 ? "REACHABLE" : "UNHEALTHY",
      url: mcpUrl,
      httpStatus: upstream.status,
      latencyMs: Date.now() - startTime,
      protocolVersion: "2024-11-05",
      note: "MCP streamable HTTP endpoint probed; tool calls require session initialize.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error probing MCP";
    return NextResponse.json(
      {
        success: false,
        status: "UNREACHABLE",
        url: mcpUrl,
        error: errorMsg,
        latencyMs: Date.now() - startTime,
      },
      { status: 502 }
    );
  }
}

export async function POST() {
  return GET();
}
