"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-surface-raised)] px-6 py-3">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Multi-Engine Airplane Guide
        </h2>
        <span className="hidden sm:inline-flex label-caps text-gold">
          Diamond DA42-VI
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Search" className="rounded p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)] transition-colors">
          <Search className="h-4 w-4" />
        </button>
        <button aria-label="Notifications" className="rounded p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)] transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-sm bg-[var(--color-gold)]" />
        </button>
        <div aria-label="User profile" className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold-dim text-sm font-semibold text-gold">
          P
        </div>
      </div>
    </header>
  );
}
