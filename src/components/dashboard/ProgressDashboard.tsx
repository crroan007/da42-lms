"use client";

import { useProgress } from "@/hooks/useProgress";
import { CheckCircle2, Circle, Clock, Minus } from "lucide-react";

interface ModuleData {
  slug: string;
  title: string;
  orderIndex: number;
  estimatedMinutes: number;
}

interface ProgressDashboardProps {
  modules: ModuleData[];
}

export function ProgressDashboard({ modules }: ProgressDashboardProps) {
  const { completedCount, avgScore, getModuleStatus, getQuizScore, loading } = useProgress();
  const totalModules = modules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Gauge */}
      <div className="panel p-6 flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-overlay" />
            <circle
              cx="50" cy="50" r="45" fill="none" stroke="var(--color-gold)" strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-text-primary font-mono">
              {loading ? "--" : `${progressPercent}%`}
            </span>
            <span className="label-caps mt-0.5">Complete</span>
          </div>
        </div>
        <div className="flex gap-8 mt-4 text-center">
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">
              {loading ? "--" : completedCount}
            </p>
            <p className="label-caps">Completed</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">
              {loading ? "--" : totalModules - completedCount}
            </p>
            <p className="label-caps">Remaining</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">
              {loading ? "--" : avgScore !== null ? `${avgScore}%` : "--"}
            </p>
            <p className="label-caps">Avg Score</p>
          </div>
        </div>
      </div>

      {/* Module checklist */}
      <div className="panel overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle">
          <h2 className="label-caps">Module Checklist</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-14">#</th>
              <th>Module</th>
              <th className="w-24">Duration</th>
              <th className="w-20">Score</th>
              <th className="w-16">Status</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, i) => {
              const status = getModuleStatus(mod.slug);
              const quiz = getQuizScore(mod.slug);
              const perfect = quiz && quiz.score === quiz.total;

              return (
                <tr key={mod.slug}>
                  <td>
                    <span className="font-mono text-xs text-gold-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="text-text-secondary text-sm">{mod.title}</td>
                  <td>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono">{mod.estimatedMinutes}</span> min
                    </span>
                  </td>
                  <td>
                    {quiz ? (
                      <span className={`font-mono text-xs ${perfect ? "text-status-operational" : "text-status-caution"}`}>
                        {quiz.score}/{quiz.total}
                      </span>
                    ) : (
                      <Minus className="h-3 w-3 text-text-faint" />
                    )}
                  </td>
                  <td>
                    {perfect ? (
                      <CheckCircle2 className="h-4 w-4 text-status-operational" />
                    ) : status === "in_progress" ? (
                      <Circle className="h-4 w-4 text-gold" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-text-faint" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
