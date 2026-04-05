"use client";

import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface ModuleData {
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  estimatedMinutes: number;
}

interface DashboardModulesProps {
  modules: ModuleData[];
}

export function DashboardModules({ modules }: DashboardModulesProps) {
  const { isModuleUnlocked, getModuleStatus, getQuizScore, loading } = useProgress();
  const allSlugs = modules.map((m) => m.slug);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {modules.slice(0, 6).map((mod, i) => {
        const unlocked = loading || isModuleUnlocked(mod.orderIndex, allSlugs);
        const status = getModuleStatus(mod.slug);
        const quiz = getQuizScore(mod.slug);
        const perfect = quiz && quiz.score === quiz.total;
        const progressWidth = perfect ? "100%" : status === "in_progress" ? "50%" : "0%";
        const accentStatus = perfect ? "complete" : status === "in_progress" ? "active" : "locked";

        return (
          <div key={mod.slug} className={`panel accent-strip-top p-4 ${!unlocked ? "opacity-40" : ""}`} data-status={accentStatus}>
            {unlocked ? (
              <Link href={`/modules/${mod.slug}`} className="block group">
                <ModuleCardContent mod={mod} i={i} progressWidth={progressWidth} quiz={quiz} />
              </Link>
            ) : (
              <div className="relative">
                <ModuleCardContent mod={mod} i={i} progressWidth="0%" quiz={null} />
                <div className="absolute top-2 right-2">
                  <Lock className="h-3.5 w-3.5 text-text-faint" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ModuleCardContent({ mod, i, progressWidth, quiz }: {
  mod: ModuleData; i: number; progressWidth: string;
  quiz: { score: number; total: number } | null;
}) {
  return (
    <>
      <div className="flex items-start justify-between mb-2">
        <span className="flex h-7 w-7 items-center justify-center bg-surface-overlay text-xs font-mono font-semibold text-gold">
          {String(mod.orderIndex || i + 1).padStart(2, "0")}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          <span className="font-mono">{mod.estimatedMinutes}</span> min
        </span>
      </div>
      <h3 className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors mb-1">
        {mod.title}
      </h3>
      <p className="text-xs text-text-secondary line-clamp-2">{mod.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex-1 h-1 bg-surface-overlay mr-3">
          <div className="h-full bg-gold" style={{ width: progressWidth }} />
        </div>
        {quiz && (
          <span className="font-mono text-xs text-text-muted">{quiz.score}/{quiz.total}</span>
        )}
      </div>
    </>
  );
}
