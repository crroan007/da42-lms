import { NextRequest } from "next/server";

const VOICE = "en-GB-SoniaNeural";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== "string" || text.length > 10000) {
    return new Response(JSON.stringify({ error: "Invalid text" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { EdgeTTS } = await import("@travisvn/edge-tts");
    const tts = new EdgeTTS(text, VOICE);
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return new Response(JSON.stringify({ error: "TTS generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
