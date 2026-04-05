"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="lg:hidden text-center mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">DA42-VI Training</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Multi-Engine Ground School</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Sign in</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">Access your training dashboard</p>

        {error && (
          <div className="mb-4 p-3 bg-[var(--color-status-warning)]/10 border border-[var(--color-status-warning)]/20 text-sm text-[var(--color-status-warning)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pilot@example.com"
              required
              className="w-full px-3 py-2.5 bg-transparent border-0 border-b border-b-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-b-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2.5 bg-transparent border-0 border-b border-b-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-b-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--color-gold)] text-[var(--color-surface-base)] font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            No account?{" "}
            <Link href="/register" className="text-[var(--color-gold)] font-medium hover:opacity-80 transition-opacity">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
