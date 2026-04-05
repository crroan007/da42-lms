"use client";

import { useCallback, useEffect, useState } from "react";

interface ProgressEntry {
  id: string;
  user_id: string;
  module_slug: string;
  status: "not_started" | "in_progress" | "completed";
  quiz_score: number | null;
  quiz_total: number | null;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || []);
      }
    } catch {
      // Not logged in or API error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getModuleStatus = useCallback(
    (slug: string): "not_started" | "in_progress" | "completed" => {
      const entry = progress.find((p) => p.module_slug === slug);
      return entry?.status ?? "not_started";
    },
    [progress]
  );

  const getQuizScore = useCallback(
    (slug: string): { score: number; total: number } | null => {
      const entry = progress.find((p) => p.module_slug === slug);
      if (entry?.quiz_score !== null && entry?.quiz_score !== undefined) {
        return { score: entry.quiz_score, total: entry.quiz_total ?? 5 };
      }
      return null;
    },
    [progress]
  );

  const markStarted = useCallback(async (moduleSlug: string) => {
    const existing = progress.find((p) => p.module_slug === moduleSlug);
    if (existing) return; // Already tracked

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, status: "in_progress" }),
      });
      await fetchProgress();
    } catch {}
  }, [progress, fetchProgress]);

  /** Check if a module is unlocked. Module 1 always unlocked. Others require 100% on previous quiz. */
  const isModuleUnlocked = useCallback(
    (orderIndex: number, allModuleSlugs: string[]): boolean => {
      if (orderIndex <= 1) return true; // Module 1 always unlocked
      const prevSlug = allModuleSlugs[orderIndex - 2]; // orderIndex is 1-based
      if (!prevSlug) return true;
      const prevEntry = progress.find((p) => p.module_slug === prevSlug);
      if (!prevEntry) return false;
      // Must have 100% quiz score to unlock next
      return prevEntry.quiz_score !== null && prevEntry.quiz_total !== null && prevEntry.quiz_score === prevEntry.quiz_total;
    },
    [progress]
  );

  const saveQuizScore = useCallback(async (moduleSlug: string, score: number, total: number) => {
    try {
      const passed = score === total; // 100% required
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug,
          status: passed ? "completed" : "in_progress",
          quizScore: score,
          quizTotal: total,
        }),
      });
      await fetchProgress();
    } catch {}
  }, [fetchProgress]);

  const completedCount = progress.filter((p) => p.status === "completed").length;
  const totalScore = progress.reduce((sum, p) => sum + (p.quiz_score ?? 0), 0);
  const scoredCount = progress.filter((p) => p.quiz_score !== null).length;
  const avgScore = scoredCount > 0 ? Math.round((totalScore / (scoredCount * 5)) * 100) : null;

  return {
    progress,
    loading,
    getModuleStatus,
    getQuizScore,
    markStarted,
    saveQuizScore,
    isModuleUnlocked,
    completedCount,
    avgScore,
    refresh: fetchProgress,
  };
}
