"use client";

import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseModule {
  number: number;
  title: string;
  status: "completed" | "in_progress" | "locked";
}

interface CourseMapProps {
  modules: CourseModule[];
  className?: string;
}

const statusConfig = {
  completed: {
    icon: Check,
    ringClass:
      "border-[var(--color-status-operational)] bg-[rgba(34,197,94,0.10)]",
    iconClass: "text-[var(--color-status-operational)]",
    lineClass: "bg-[var(--color-status-operational)] opacity-40",
    textClass: "text-[var(--color-text-primary)]",
    subtextClass: "text-[var(--color-text-muted)]",
    dotFill: true,
  },
  in_progress: {
    icon: Play,
    ringClass: "border-[var(--color-gold)] bg-[var(--color-gold-dim)]",
    iconClass: "text-gold",
    lineClass: "bg-[var(--color-border-subtle)]",
    textClass: "text-[var(--color-text-primary)]",
    subtextClass: "text-gold",
    dotFill: false,
  },
  locked: {
    icon: Lock,
    ringClass:
      "border-[var(--color-border-default)] bg-[var(--color-surface-sunken)]",
    iconClass: "text-[var(--color-text-faint)]",
    lineClass: "bg-[var(--color-border-subtle)]",
    textClass: "text-[var(--color-text-muted)]",
    subtextClass: "text-[var(--color-text-faint)]",
    dotFill: false,
  },
};

export function CourseMap({ modules, className }: CourseMapProps) {
  return (
    <div className={cn("relative", className)}>
      {modules.map((mod, i) => {
        const config = statusConfig[mod.status];
        const Icon = config.icon;
        const isLast = i === modules.length - 1;

        return (
          <div
            key={mod.number}
            className="relative flex items-start gap-3 pb-5"
          >
            {/* Connecting line — hard, no gradient */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[16px] top-[36px] w-px h-[calc(100%-26px)]",
                  config.lineClass
                )}
              />
            )}

            {/* Status indicator — filled circle for complete, outline for pending */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "flex h-[34px] w-[34px] items-center justify-center rounded border-2 transition-colors",
                  config.ringClass
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", config.iconClass)} />
              </div>
              {/* Active indicator — solid dot, no pulse */}
              {mod.status === "in_progress" && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-sm bg-[var(--color-gold)]" />
              )}
            </div>

            {/* Content */}
            <div className="pt-1 min-w-0">
              <p
                className={cn(
                  "label-caps mb-0.5",
                  config.subtextClass
                )}
              >
                Module <span className="font-mono">{mod.number}</span>
              </p>
              <p
                className={cn(
                  "text-sm font-medium leading-snug truncate",
                  config.textClass
                )}
              >
                {mod.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
