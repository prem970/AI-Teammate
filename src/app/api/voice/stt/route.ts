import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/** Speech-to-text via Sarvam (saaras:v3). Key stays server-side. */
export async function POST(request: NextRequest) {
  const apiKey = (process.env.SARVAM_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "SARVAM_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file") || form.get("audio");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing audio file field `file`." },
        { status: 400 }
      );
    }

    const languageCode = String(form.get("language_code") || "unknown");
    const mode = String(form.get("mode") || "transcribe");

    const filename =
      file instanceof File && file.name
        ? file.name
        : `recording.${(file.type || "audio/webm").includes("wav") ? "wav" : "webm"}`;

    const upstream = new FormData();
    upstream.append("file", file, filename);
    upstream.append("model", "saaras:v3");
    upstream.append("mode", mode);
    if (languageCode) upstream.append("language_code", languageCode);

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: upstream,
      signal: AbortSignal.timeout(60_000),
    });

    const data = await res.json().catch(async () => ({
      raw: await res.text(),
    }));

    if (!res.ok) {
      const detailMsg =
        (typeof data?.error?.message === "string" && data.error.message) ||
        (typeof data?.message === "string" && data.message) ||
        (typeof data?.detail === "string" && data.detail) ||
        JSON.stringify(data).slice(0, 300);
      return NextResponse.json(
        {
          error: `Sarvam speech-to-text failed: ${detailMsg}`,
          detail: data,
        },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }

    const transcript =
      (typeof data?.transcript === "string" && data.transcript) ||
      (typeof data?.text === "string" && data.text) ||
      "";

    return NextResponse.json({
      success: true,
      transcript: transcript.trim(),
      language_code: data?.language_code || null,
      request_id: data?.request_id || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "STT request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
