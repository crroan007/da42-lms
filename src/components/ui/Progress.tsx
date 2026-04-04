"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const trackSizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  className,
  showLabel = false,
  size = "md",
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="label-caps">Progress</span>
          <span className="text-xs font-mono font-medium text-gold">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-sm bg-[var(--color-surface-sunken)] overflow-hidden",
          trackSizes[size]
        )}
      >
        <div
          className="h-full rounded-sm bg-[var(--color-gold)] transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
