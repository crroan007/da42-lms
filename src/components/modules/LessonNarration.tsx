"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTTS } from "@/hooks/useTTS";
import type { LessonBlock } from "@/types";
import { createContext, useContext } from "react";

/** Context so all lessons share the same TTS instance */
const TTSContext = createContext<ReturnType<typeof useTTS> | null>(null);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const tts = useTTS();
  return <TTSContext.Provider value={tts}>{children}</TTSContext.Provider>;
}

function useTTSContext() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("TTSProvider required");
  return ctx;
}

interface LessonNarrationToggleProps {
  sectionIndex: number;
  title: string;
  blocks?: LessonBlock[];
  content?: string;
}

/** Extracts narration segments from lesson blocks — one segment per block for natural pacing */
function extractSegments(title: string, blocks?: LessonBlock[], content?: string): string[] {
  const segments: string[] = [];

  if (blocks && blocks.length > 0) {
    for (const block of blocks) {
      switch (block.type) {
        case "text":
          segments.push(block.content);
          break;
        case "concept":
          segments.push(`${block.title}. ${block.content}`);
          break;
        case "analogy":
          segments.push(`Think of it like this. ${block.content}`);
          break;
        case "example":
          segments.push(`Here's an example. ${block.title ? block.title + ". " : ""}${block.content}`);
          break;
        case "warning":
          segments.push(`Important. ${block.content}`);
          break;
        case "keypoint":
          segments.push(`Key point. ${block.content}`);
          break;
        case "formula":
          segments.push(`${block.label}. ${block.formula}. ${block.explanation}`);
          break;
        case "list":
          if (block.title) {
            const items = block.items.map((item, i) => `${i + 1}. ${item}`).join(". ");
            segments.push(`${block.title} ${items}`);
          } else {
            segments.push(block.items.join(". "));
          }
          break;
        case "memorize":
          const specs = block.items.map((item) => `${item.label}: ${item.value}`).join(". ");
          segments.push(`Memorize these values. ${specs}`);
          break;
        case "check":
          segments.push(`Quick check. ${block.question}`);
          break;
        case "figure":
          segments.push(`Refer to the diagram: ${block.caption}`);
          break;
      }
    }
  } else if (content) {
    // Split legacy content into paragraphs as segments
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 20);
    segments.push(...paragraphs);
  }

  return segments;
}

export function LessonNarrationToggle({ sectionIndex, title, blocks, content }: LessonNarrationToggleProps) {
  const { toggleNarration, activeSection, isLoading, isPlaying } = useTTSContext();

  const isActive = activeSection === sectionIndex;
  const segments = extractSegments(title, blocks, content);

  const handleClick = () => {
    toggleNarration(sectionIndex, segments);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80 flex-shrink-0 ${
        isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
      }`}
      title={isActive ? "Stop narration" : `Narrate: ${title}`}
    >
      {isActive && isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isActive && isPlaying ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
      <span>{isActive ? "Stop" : "Listen"}</span>
    </button>
  );
}
