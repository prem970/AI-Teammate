import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function stripForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/`+/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2400);
}

/** Text-to-speech via Sarvam (bulbul:v3). Key stays server-side. */
export async function POST(request: NextRequest) {
  const apiKey = (process.env.SARVAM_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "SARVAM_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const text = stripForSpeech(String(body.text || ""));
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const languageCode = String(body.language_code || "en-IN");
    const speaker = String(body.speaker || "shubh");

    const res = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        // REST docs use language_code; some SDK samples use target_language_code
        language_code: languageCode,
        target_language_code: languageCode,
        model: "bulbul:v3",
        speaker,
        pace: 1.0,
        speech_sample_rate: 24000,
        output_audio_codec: "wav",
      }),
      signal: AbortSignal.timeout(60_000),
    });

    const data = await res.json().catch(async () => ({
      raw: await res.text(),
    }));

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Sarvam text-to-speech failed",
          detail: data,
        },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }

    const audios = Array.isArray(data?.audios) ? data.audios : [];
    const audioBase64 = audios.filter((a: unknown) => typeof a === "string").join("");
    if (!audioBase64) {
      return NextResponse.json(
        { error: "Sarvam returned no audio", detail: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      audioBase64,
      mimeType: "audio/wav",
      request_id: data?.request_id || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "TTS request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
