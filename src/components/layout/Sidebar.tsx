"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  User,
  Plane,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Modules", href: "/modules", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--color-border-default)] bg-[var(--color-surface-raised)] transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border-default)]",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded bg-gold-dim text-gold flex-shrink-0">
            <Plane className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-gold">DA42-VI</h1>
              <p className="label-caps">Training Platform</p>
            </div>
          )}
        </div>

        {/* Nav section label */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-1">
            <span className="label-caps">Navigation</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "border-l-[3px] border-l-[var(--color-gold)] bg-[var(--color-gold-dim)] text-gold pl-2.5"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)]",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0",
                    isActive
                      ? "text-gold"
                      : "text-[var(--color-text-muted)]"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="border-t border-[var(--color-border-default)] p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center rounded p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-overlay)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
