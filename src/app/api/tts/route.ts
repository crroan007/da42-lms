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
    // Use the Communicate streaming API (more reliable than EdgeTTS.synthesize)
    const { Communicate } = await import("@travisvn/edge-tts");
    const comm = new Communicate(text, { voice: VOICE });

    const chunks: Buffer[] = [];
    for await (const chunk of comm.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        chunks.push(chunk.data);
      }
    }

    if (chunks.length === 0) {
      return new Response(JSON.stringify({ error: "No audio generated" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);

    // If Node.js edge-tts fails, try Python fallback (local dev only)
    try {
      const { exec } = await import("child_process");
      const { writeFile, readFile, unlink } = await import("fs/promises");
      const { randomUUID } = await import("crypto");
      const path = await import("path");
      const os = await import("os");

      const id = randomUUID();
      const tmpText = path.join(os.tmpdir(), `tts-${id}.txt`);
      const tmpAudio = path.join(os.tmpdir(), `tts-${id}.mp3`);
      const scriptPath = path.join(process.cwd(), "scripts", "tts.py");

      await writeFile(tmpText, text, "utf-8");

      await new Promise<void>((resolve, reject) => {
        exec(
          `python "${scriptPath}" "${tmpAudio}" < "${tmpText}"`,
          { timeout: 30000 },
          (error) => (error ? reject(error) : resolve())
        );
      });

      const audioBuffer = await readFile(tmpAudio);
      await unlink(tmpText).catch(() => {});
      await unlink(tmpAudio).catch(() => {});

      return new Response(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=604800",
        },
      });
    } catch {
      return new Response(JSON.stringify({ error: "TTS generation failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
