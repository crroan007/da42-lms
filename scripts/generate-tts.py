"""Pre-generate TTS audio for all lesson content using edge-tts.
Generates MP3 files in public/audio/lessons/ with a manifest.json mapping.
Run: python scripts/generate-tts.py
"""
import asyncio
import json
import os
import sys
import hashlib
import edge_tts

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

VOICE = "en-GB-SoniaNeural"
CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "content", "modules")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "lessons")
MANIFEST_PATH = os.path.join(OUTPUT_DIR, "manifest.json")


def extract_segments(title, blocks=None, content=None):
    """Extract narration segments from lesson blocks."""
    segments = []
    if blocks:
        for block in blocks:
            t = block.get("type", "")
            if t == "text":
                segments.append(block["content"])
            elif t == "concept":
                segments.append(f'{block["title"]}. {block["content"]}')
            elif t == "analogy":
                segments.append(f'Think of it like this. {block["content"]}')
            elif t == "example":
                title_str = f'{block.get("title", "")}. ' if block.get("title") else ""
                segments.append(f'Here is an example. {title_str}{block["content"]}')
            elif t == "warning":
                segments.append(f'Important. {block["content"]}')
            elif t == "keypoint":
                segments.append(f'Key point. {block["content"]}')
            elif t == "formula":
                segments.append(f'{block["label"]}. {block["formula"]}. {block["explanation"]}')
            elif t == "list":
                items = ". ".join(f"{i+1}. {item}" for i, item in enumerate(block["items"]))
                prefix = f'{block["title"]} ' if block.get("title") else ""
                segments.append(f"{prefix}{items}")
            elif t == "memorize":
                specs = ". ".join(f'{item["label"]}: {item["value"]}' for item in block["items"])
                segments.append(f"Memorize these values. {specs}")
            elif t == "check":
                segments.append(f'Quick check. {block["question"]}')
            elif t == "figure":
                segments.append(f'Refer to the diagram: {block["caption"]}')
    elif content:
        paragraphs = [p.strip() for p in content.split("\n\n") if len(p.strip()) > 20]
        segments.extend(paragraphs)
    return segments


async def generate_audio(text, filepath):
    """Generate an MP3 file from text."""
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(filepath)


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load existing manifest to skip already-generated files
    manifest = {}
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH) as f:
            manifest = json.load(f)

    # Load index
    index_path = os.path.join(CONTENT_DIR, "index.json")
    with open(index_path) as f:
        index = json.load(f)

    total_generated = 0
    total_skipped = 0

    for entry in index["modules"]:
        slug = entry["slug"]
        module_path = os.path.join(CONTENT_DIR, f"{slug}.json")
        with open(module_path) as f:
            module = json.load(f)

        sections = module.get("subsections") or module.get("lessons") or []

        for sec_idx, section in enumerate(sections):
            title = section.get("title", f"Section {sec_idx + 1}")
            blocks = section.get("blocks")
            content = section.get("content")
            segments = extract_segments(title, blocks, content)

            # Combine all segments into one audio file per section
            full_text = " ".join(segments)
            if not full_text.strip():
                continue

            # Create a content hash for cache-busting
            text_hash = hashlib.md5(full_text.encode()).hexdigest()[:8]
            audio_key = f"{slug}_s{sec_idx}"
            filename = f"{audio_key}_{text_hash}.mp3"
            filepath = os.path.join(OUTPUT_DIR, filename)

            # Skip if already generated with same content
            if audio_key in manifest and manifest[audio_key]["hash"] == text_hash:
                if os.path.exists(os.path.join(OUTPUT_DIR, manifest[audio_key]["file"])):
                    total_skipped += 1
                    continue

            print(f"  Generating: {slug} section {sec_idx} ({len(full_text)} chars)...")
            try:
                await generate_audio(full_text, filepath)
                manifest[audio_key] = {
                    "file": filename,
                    "hash": text_hash,
                    "slug": slug,
                    "section": sec_idx,
                    "chars": len(full_text),
                }
                total_generated += 1
            except Exception as e:
                print(f"  ERROR: {e}")

    # Write manifest
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone! Generated: {total_generated}, Skipped: {total_skipped}")
    print(f"Manifest: {MANIFEST_PATH}")
    print(f"Audio dir: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
