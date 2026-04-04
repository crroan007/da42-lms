import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

const badgeVariants = {
  success:
    "bg-[rgba(34,197,94,0.10)] text-[var(--color-status-operational)] border-[rgba(34,197,94,0.20)]",
  warning:
    "bg-[var(--color-gold-dim)] text-[var(--color-gold)] border-[rgba(201,168,76,0.20)]",
  danger:
    "bg-[rgba(239,68,68,0.10)] text-[var(--color-status-warning)] border-[rgba(239,68,68,0.20)]",
  info:
    "bg-[rgba(56,189,248,0.10)] text-[var(--color-status-advisory)] border-[rgba(56,189,248,0.20)]",
  gold:
    "bg-[var(--color-gold-dim)] text-[var(--color-gold)] border-[rgba(201,168,76,0.20)]",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "gold", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
