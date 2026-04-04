"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";

interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  progress: number; // 0-100
  status: "not_started" | "in_progress" | "completed";
  slug: string;
  className?: string;
}

const statusBadge = {
  not_started: { label: "Not Started", variant: "info" as const },
  in_progress: { label: "In Progress", variant: "warning" as const },
  completed: { label: "Completed", variant: "success" as const },
};

const statusToAccent = {
  not_started: "locked",
  in_progress: "active",
  completed: "complete",
} as const;

export function ModuleCard({
  number,
  title,
  description,
  estimatedMinutes,
  progress,
  status,
  slug,
  className,
}: ModuleCardProps) {
  const badge = statusBadge[status];

  return (
    <Link href={`/modules/${slug}`} className="block">
      <div
        className={cn(
          "panel accent-strip-top p-3 cursor-pointer transition-lift",
          className
        )}
        data-status={statusToAccent[status]}
      >
        {/* Top row: number badge + status */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm font-semibold text-gold">
            {String(number).padStart(2, "0")}
          </span>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Bottom row */}
        <div className="space-y-2">
          <Progress value={progress} size="sm" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-faint)]">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{estimatedMinutes} min</span>
            </div>
            <span className="font-mono text-xs font-medium text-gold">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
