"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, Lightbulb, AlertTriangle, CheckCircle2, BookOpen, Zap } from "lucide-react";
import type { LessonBlock } from "@/types";
import { useState } from "react";

interface ContentRendererProps {
  blocks?: LessonBlock[];
  /** Legacy: raw text string from old format */
  content?: string;
  className?: string;
}

export function ContentRenderer({ blocks, content, className }: ContentRendererProps) {
  // If we have rich blocks, render them
  if (blocks && blocks.length > 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    );
  }

  // Legacy: render raw text
  if (content) {
    return <LegacyRenderer content={content} className={className} />;
  }

  return null;
}

function BlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {block.content}
        </p>
      );

    case "concept":
      return (
        <div className="panel p-4 border-l-[3px] border-l-[var(--color-status-advisory)]">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-[var(--color-status-advisory)]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-status-advisory)]">
              Key Concept
            </span>
          </div>
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{block.title}</h4>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{block.content}</p>
        </div>
      );

    case "analogy":
      return (
        <div className="panel p-4 border-l-[3px] border-l-[var(--color-gold)]">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-gold)]">
              Think of it like...
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] italic">{block.content}</p>
        </div>
      );

    case "example":
      return (
        <div className="panel p-4 border-l-[3px] border-l-[var(--color-status-operational)]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-[var(--color-status-operational)]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-status-operational)]">
              Example
            </span>
          </div>
          {block.title && (
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{block.title}</h4>
          )}
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{block.content}</p>
        </div>
      );

    case "warning":
      return (
        <div className="panel p-4 border-l-[3px] border-l-[var(--color-status-caution)]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-[var(--color-status-caution)]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-status-caution)]">
              Important
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{block.content}</p>
        </div>
      );

    case "keypoint":
      return (
        <div className="bg-[var(--color-gold-dim)] border border-[var(--color-border-subtle)] p-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{block.content}</p>
        </div>
      );

    case "figure":
      return (
        <div className="flex flex-col items-center justify-center gap-2 border border-[var(--color-border-default)] border-dashed bg-[var(--color-surface-sunken)] p-6">
          <ImageIcon className="h-6 w-6 text-[var(--color-text-faint)]" />
          <p className="text-xs text-[var(--color-text-muted)] text-center">{block.caption}</p>
        </div>
      );

    case "check":
      return <InlineCheck question={block.question} answer={block.answer} />;

    case "formula":
      return (
        <div className="panel p-4">
          <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{block.label}</p>
          <p className="font-mono text-base text-[var(--color-text-primary)] mb-2">{block.formula}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{block.explanation}</p>
        </div>
      );

    case "list":
      return (
        <div>
          {block.title && (
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">{block.title}</p>
          )}
          <ul className="space-y-1.5 ml-1">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-text-faint)] font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "memorize":
      return (
        <div className="panel p-4 border-l-[3px] border-l-[var(--color-status-caution)]">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[var(--color-status-caution)]">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-status-caution)]">
              Memorize
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-baseline justify-between gap-2 py-1 border-b border-[var(--color-border-subtle)]">
                <span className="text-xs text-[var(--color-text-muted)]">{item.label}</span>
                <span className="font-mono font-semibold text-sm text-[var(--color-text-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

function InlineCheck({ question, answer }: { question: string; answer: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="panel p-4 border-l-[3px] border-l-[var(--color-status-active)]">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-4 w-4 text-[var(--color-status-active)]" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-status-active)]">
          Quick Check
        </span>
      </div>
      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{question}</p>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-sm text-[var(--color-gold)] hover:opacity-80 transition-opacity"
        >
          Reveal answer
        </button>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface-sunken)] p-2">{answer}</p>
      )}
    </div>
  );
}

/** Legacy renderer for raw text content */
function LegacyRenderer({ content, className }: { content: string; className?: string }) {
  const lines = content
    .split(/\n\n|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className={cn("space-y-3", className)}>
      {lines.map((line, i) => {
        const figureMatch = line.match(/^\[FIGURE:\s*(.+?)\]$/);
        if (figureMatch) {
          return (
            <div key={i} className="flex flex-col items-center justify-center gap-2 border border-[var(--color-border-default)] border-dashed bg-[var(--color-surface-sunken)] p-6">
              <ImageIcon className="h-6 w-6 text-[var(--color-text-faint)]" />
              <p className="text-xs text-[var(--color-text-muted)] text-center">{figureMatch[1]}</p>
            </div>
          );
        }

        if (line.endsWith(":") && line.length < 80 && !line.includes(".")) {
          return (
            <h3 key={i} className="text-sm font-semibold text-[var(--color-text-primary)] mt-4 mb-1 border-b border-[var(--color-border-subtle)] pb-2">
              {line.slice(0, -1)}
            </h3>
          );
        }

        return (
          <p key={i} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {line}
          </p>
        );
      })}
    </div>
  );
}
