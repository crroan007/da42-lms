"use client";

import Link from "next/link";
import { Clock, BookOpen, Lock, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface ModuleEntry {
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  estimatedMinutes: number;
  subsectionCount: number;
}

interface ModuleTableProps {
  modules: ModuleEntry[];
}

export function ModuleTable({ modules }: ModuleTableProps) {
  const { isModuleUnlocked, getModuleStatus, getQuizScore, loading } = useProgress();
  const allSlugs = modules.map((m) => m.slug);

  return (
    <div className="panel overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-14">#</th>
            <th>Module</th>
            <th className="hidden sm:table-cell w-24">Duration</th>
            <th className="hidden sm:table-cell w-24">Sections</th>
            <th className="w-24">Status</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => {
            const unlocked = loading || isModuleUnlocked(mod.orderIndex, allSlugs);
            const status = getModuleStatus(mod.slug);
            const quiz = getQuizScore(mod.slug);
            const perfect = quiz && quiz.score === quiz.total;

            return (
              <tr key={mod.slug} className={!unlocked ? "opacity-50" : undefined}>
                <td>
                  <span className="font-mono font-semibold text-gold text-xs">
                    {String(mod.orderIndex).padStart(2, "0")}
                  </span>
                </td>
                <td>
                  {unlocked ? (
                    <Link
                      href={`/modules/${mod.slug}`}
                      className="text-text-primary hover:text-gold transition-colors font-medium"
                    >
                      {mod.title}
                    </Link>
                  ) : (
                    <span className="text-text-faint font-medium">{mod.title}</span>
                  )}
                  <p className="text-text-muted text-xs mt-0.5 truncate max-w-md">
                    {mod.description}
                  </p>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{mod.estimatedMinutes}</span> min
                  </span>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <BookOpen className="h-3 w-3" />
                    <span className="font-mono">{mod.subsectionCount}</span>
                  </span>
                </td>
                <td>
                  {!unlocked ? (
                    <span className="flex items-center gap-1 label-caps text-text-faint">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  ) : perfect ? (
                    <span className="flex items-center gap-1 label-caps text-[var(--color-status-operational)]">
                      <CheckCircle2 className="h-3 w-3" /> {quiz.score}/{quiz.total}
                    </span>
                  ) : quiz ? (
                    <span className="flex items-center gap-1 label-caps text-[var(--color-status-caution)]">
                      {quiz.score}/{quiz.total}
                    </span>
                  ) : status === "in_progress" ? (
                    <span className="label-caps text-gold">In Progress</span>
                  ) : (
                    <span className="label-caps text-text-muted">Open</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
