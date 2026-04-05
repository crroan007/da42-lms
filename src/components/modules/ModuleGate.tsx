"use client";

import { useProgress } from "@/hooks/useProgress";
import { Lock } from "lucide-react";
import Link from "next/link";

interface ModuleGateProps {
  orderIndex: number;
  allSlugs: string[];
  children: React.ReactNode;
}

/** Blocks access to a module unless the previous module's quiz has 100% */
export function ModuleGate({ orderIndex, allSlugs, children }: ModuleGateProps) {
  const { isModuleUnlocked, loading } = useProgress();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <span className="text-sm text-[var(--color-text-muted)]">Loading...</span>
      </div>
    );
  }

  const unlocked = isModuleUnlocked(orderIndex, allSlugs);

  if (!unlocked) {
    const prevIndex = orderIndex - 1;
    const prevSlug = allSlugs[prevIndex - 1];
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/modules" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors">
          &larr; Back to Modules
        </Link>
        <div className="panel p-8 text-center">
          <Lock className="h-10 w-10 text-[var(--color-text-faint)] mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Module Locked</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-4 max-w-md mx-auto">
            You need a perfect score (100%) on the Module {String(prevIndex).padStart(2, "0")} quiz before you can access this module.
          </p>
          {prevSlug && (
            <Link
              href={`/modules/${prevSlug}/quiz`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[var(--color-gold)] text-[var(--color-surface-base)] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Take Module {String(prevIndex).padStart(2, "0")} Quiz
            </Link>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
