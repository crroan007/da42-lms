"""Generate TTS audio from text using edge-tts (Microsoft Neural TTS).
Usage: python scripts/tts.py <output_file>
Text is read from stdin.
"""
import asyncio
import sys
import edge_tts

# Suppress Windows asyncio cleanup warning
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

VOICE = "en-GB-SoniaNeural"

async def main():
    output_file = sys.argv[1]
    text = sys.stdin.read().strip()
    if not text:
        sys.exit(1)
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(output_file)

asyncio.run(main())
