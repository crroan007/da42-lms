import { NextRequest } from "next/server";
import { exec } from "child_process";
import { createReadStream } from "fs";
import { readFile, unlink, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import os from "os";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== "string" || text.length > 10000) {
    return new Response(JSON.stringify({ error: "Invalid text" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = randomUUID();
  const tmpText = path.join(os.tmpdir(), `tts-${id}.txt`);
  const tmpAudio = path.join(os.tmpdir(), `tts-${id}.mp3`);
  const scriptPath = path.join(process.cwd(), "scripts", "tts.py");

  try {
    // Write text to temp file to avoid shell escaping issues
    await writeFile(tmpText, text, "utf-8");

    // Run Python edge-tts script
    await new Promise<void>((resolve, reject) => {
      const proc = exec(
        `python "${scriptPath}" "${tmpAudio}"`,
        { timeout: 30000 },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
      // Pipe text via stdin
      const input = createReadStream(tmpText);
      input.pipe(proc.stdin!);
    });

    const audioBuffer = await readFile(tmpAudio);

    // Cleanup
    await unlink(tmpText).catch(() => {});
    await unlink(tmpAudio).catch(() => {});

    if (audioBuffer.length === 0) {
      return new Response(JSON.stringify({ error: "Empty audio" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch (err) {
    // Cleanup on error
    await unlink(tmpText).catch(() => {});
    await unlink(tmpAudio).catch(() => {});
    console.error("TTS error:", err);
    return new Response(JSON.stringify({ error: "TTS generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
