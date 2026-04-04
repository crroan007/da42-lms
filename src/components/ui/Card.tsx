"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  className?: string;
}

export function Card({
  children,
  hoverable = false,
  elevated = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        elevated ? "panel-elevated" : "panel",
        "p-4",
        hoverable && "cursor-pointer transition-lift",
        className
      )}
    >
      {children}
    </div>
  );
}
