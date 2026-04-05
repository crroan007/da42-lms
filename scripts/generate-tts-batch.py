"""Generate TTS for a specific range of modules. Usage: python scripts/generate-tts-batch.py START END
Example: python scripts/generate-tts-batch.py 7 10  (generates modules 07-10)
"""
import asyncio, json, os, sys, hashlib, edge_tts

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

VOICE = "en-GB-SoniaNeural"
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE, "content", "modules")
OUTPUT_DIR = os.path.join(BASE, "public", "audio", "lessons")

def extract_segments(blocks=None, content=None):
    segments = []
    if blocks:
        for b in blocks:
            t = b.get("type", "")
            if t == "text": segments.append(b["content"])
            elif t == "concept": segments.append(f'{b["title"]}. {b["content"]}')
            elif t == "analogy": segments.append(f'Think of it like this. {b["content"]}')
            elif t == "example": segments.append(f'Example. {b.get("title","")}. {b["content"]}')
            elif t == "warning": segments.append(f'Important. {b["content"]}')
            elif t == "keypoint": segments.append(f'Key point. {b["content"]}')
            elif t == "formula": segments.append(f'{b["label"]}. {b["formula"]}. {b["explanation"]}')
            elif t == "list":
                items = ". ".join(f"{i+1}. {x}" for i,x in enumerate(b["items"]))
                segments.append(f'{b.get("title","")} {items}')
            elif t == "memorize":
                segments.append("Memorize. " + ". ".join(f'{x["label"]}: {x["value"]}' for x in b["items"]))
            elif t == "check": segments.append(f'Quick check. {b["question"]}')
            elif t == "figure": segments.append(f'Diagram: {b["caption"]}')
    elif content:
        segments.extend(p.strip() for p in content.split("\n\n") if len(p.strip()) > 20)
    return segments

async def gen(text, path):
    comm = edge_tts.Communicate(text, VOICE)
    await comm.save(path)

async def main():
    start, end = int(sys.argv[1]), int(sys.argv[2])
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(os.path.join(CONTENT_DIR, "index.json")) as f:
        index = json.load(f)

    for entry in index["modules"]:
        idx = entry.get("orderIndex", 0)
        if idx < start or idx > end:
            continue
        slug = entry["slug"]
        with open(os.path.join(CONTENT_DIR, f"{slug}.json")) as f:
            mod = json.load(f)

        sections = mod.get("subsections") or mod.get("lessons") or []
        for si, sec in enumerate(sections):
            segs = extract_segments(sec.get("blocks"), sec.get("content"))
            text = " ".join(segs)
            if not text.strip():
                continue
            h = hashlib.md5(text.encode()).hexdigest()[:8]
            fname = f"{slug}_s{si}_{h}.mp3"
            fpath = os.path.join(OUTPUT_DIR, fname)
            if os.path.exists(fpath):
                print(f"  SKIP {fname}")
                continue
            print(f"  GEN  {fname} ({len(text)} chars)")
            try:
                await gen(text, fpath)
            except Exception as e:
                print(f"  ERR  {e}")

asyncio.run(main())
