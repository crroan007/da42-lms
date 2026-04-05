"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTTS } from "@/hooks/useTTS";
import type { LessonBlock } from "@/types";
import { createContext, useContext, useMemo } from "react";

interface SectionData {
  title: string;
  blocks?: LessonBlock[];
  content?: string;
}

interface TTSContextValue {
  tts: ReturnType<typeof useTTS>;
  allSegments: string[][];
}

const TTSContext = createContext<TTSContextValue | null>(null);

/** Wrap all lessons — precomputes segments for every section so narration can flow through them */
export function TTSProvider({ moduleSlug, sections, children }: { moduleSlug: string; sections: SectionData[]; children: React.ReactNode }) {
  const tts = useTTS(moduleSlug);

  const allSegments = useMemo(
    () => sections.map((s) => extractSegments(s.title, s.blocks, s.content)),
    [sections]
  );

  return (
    <TTSContext.Provider value={{ tts, allSegments }}>
      {children}
    </TTSContext.Provider>
  );
}

function useTTSContext() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("TTSProvider required");
  return ctx;
}

interface LessonNarrationToggleProps {
  sectionIndex: number;
}

export function LessonNarrationToggle({ sectionIndex }: LessonNarrationToggleProps) {
  const { tts, allSegments } = useTTSContext();
  const { toggleNarration, activeSection, isLoading, isPlaying } = tts;

  const isActive = activeSection === sectionIndex;
  const isAnySectionPlaying = isPlaying;

  const handleClick = () => {
    toggleNarration(sectionIndex, allSegments);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80 flex-shrink-0 ${
        isActive ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
      }`}
      title={isAnySectionPlaying ? "Stop narration" : "Listen from here"}
    >
      {isActive && isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isActive && isPlaying ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
      <span>{isAnySectionPlaying && isActive ? "Stop" : "Listen"}</span>
    </button>
  );
}

/** Extracts narration segments from lesson blocks */
function extractSegments(title: string, blocks?: LessonBlock[], content?: string): string[] {
  const segments: string[] = [];

  if (blocks && blocks.length > 0) {
    for (const block of blocks) {
      switch (block.type) {
        case "text": segments.push(block.content); break;
        case "concept": segments.push(`${block.title}. ${block.content}`); break;
        case "analogy": segments.push(`Think of it like this. ${block.content}`); break;
        case "example": segments.push(`Here's an example. ${block.title ? block.title + ". " : ""}${block.content}`); break;
        case "warning": segments.push(`Important. ${block.content}`); break;
        case "keypoint": segments.push(`Key point. ${block.content}`); break;
        case "formula": segments.push(`${block.label}. ${block.formula}. ${block.explanation}`); break;
        case "list":
          if (block.title) {
            segments.push(`${block.title} ${block.items.map((item, i) => `${i + 1}. ${item}`).join(". ")}`);
          } else {
            segments.push(block.items.join(". "));
          }
          break;
        case "memorize":
          segments.push(`Memorize these values. ${block.items.map((item) => `${item.label}: ${item.value}`).join(". ")}`);
          break;
        case "check": segments.push(`Quick check. ${block.question}`); break;
        case "figure": segments.push(`Refer to the diagram: ${block.caption}`); break;
      }
    }
  } else if (content) {
    segments.push(...content.split(/\n\n+/).filter((p) => p.trim().length > 20));
  }

  return segments;
}
