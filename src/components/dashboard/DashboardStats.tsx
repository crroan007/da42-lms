"use client";

import { useProgress } from "@/hooks/useProgress";
import { Target, BookOpen, Award } from "lucide-react";

interface DashboardStatsProps {
  totalModules: number;
}

export function DashboardStats({ totalModules }: DashboardStatsProps) {
  const { completedCount, avgScore, loading } = useProgress();
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="panel p-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-gold-dim">
          <Target className="h-5 w-5 text-gold" />
        </div>
        <div>
          <p className="text-xl font-semibold text-text-primary font-mono">
            {loading ? "--" : `${progressPercent}%`}
          </p>
          <p className="label-caps">Course Progress</p>
        </div>
      </div>
      <div className="panel p-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-status-advisory/10">
          <BookOpen className="h-5 w-5 text-status-advisory" />
        </div>
        <div>
          <p className="text-xl font-semibold text-text-primary font-mono">
            {loading ? "--" : `${completedCount}/${totalModules}`}
          </p>
          <p className="label-caps">Modules Complete</p>
        </div>
      </div>
      <div className="panel p-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-status-operational/10">
          <Award className="h-5 w-5 text-status-operational" />
        </div>
        <div>
          <p className="text-xl font-semibold text-text-primary font-mono">
            {loading ? "--" : avgScore !== null ? `${avgScore}%` : "--"}
          </p>
          <p className="label-caps">Avg Quiz Score</p>
        </div>
      </div>
    </div>
  );
}
