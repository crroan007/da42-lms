"use client";

import { ContentRenderer } from "@/components/modules/ContentRenderer";
import { TTSProvider, LessonNarrationToggle } from "@/components/modules/LessonNarration";
import { Target } from "lucide-react";
import type { LessonBlock } from "@/types";

interface LessonSection {
  title: string;
  objective?: string;
  pageRange: string;
  blocks?: LessonBlock[];
  content?: string;
}

interface LessonListProps {
  sections: LessonSection[];
}

export function LessonList({ sections }: LessonListProps) {
  return (
    <TTSProvider>
      <div className="space-y-4">
        {sections.map((section, i) => {
          const hasBlocks = section.blocks && section.blocks.length > 0;
          return (
            <div key={i} className="panel p-4">
              <div className="mb-3">
                <div className="flex items-start gap-2 mb-1">
                  <span className="font-mono text-xs text-[var(--color-text-faint)] mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-base font-semibold text-[var(--color-text-primary)] flex-1">
                    {section.title}
                  </h2>
                  <LessonNarrationToggle
                    sectionIndex={i}
                    title={section.title}
                    blocks={section.blocks}
                    content={section.content}
                  />
                </div>
                {section.objective && (
                  <div className="flex items-center gap-1.5 ml-5 mt-1">
                    <Target className="h-3 w-3 text-[var(--color-text-muted)]" />
                    <p className="text-xs text-[var(--color-text-muted)]">{section.objective}</p>
                  </div>
                )}
              </div>
              {hasBlocks ? (
                <ContentRenderer blocks={section.blocks} />
              ) : (
                <ContentRenderer content={section.content} />
              )}
            </div>
          );
        })}
      </div>
    </TTSProvider>
  );
}
