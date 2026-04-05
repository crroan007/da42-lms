"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, signOut } = useAuth();
  const initial = user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

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
        <button aria-label="Search" className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)] transition-colors">
          <Search className="h-4 w-4" />
        </button>
        <button aria-label="Notifications" className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)] transition-colors relative">
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={signOut}
          aria-label="Sign out"
          className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-status-warning)] transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
        <div aria-label="User profile" className="ml-1 flex h-8 w-8 items-center justify-center bg-gold-dim text-sm font-semibold text-gold">
          {initial}
        </div>
      </div>
    </header>
  );
}
