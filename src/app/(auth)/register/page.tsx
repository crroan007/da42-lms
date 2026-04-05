"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="lg:hidden text-center mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">DA42-VI Training</h1>
        </div>
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[var(--color-status-operational)]/10 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[var(--color-status-operational)]">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Check your email</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            We sent a confirmation link to <span className="font-medium text-[var(--color-text-primary)]">{email}</span>. Click the link to activate your account.
          </p>
          <Link href="/login" className="text-sm text-[var(--color-gold)] font-medium hover:opacity-80 transition-opacity">
            Back to sign in
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="lg:hidden text-center mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">DA42-VI Training</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Multi-Engine Ground School</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Create account</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">Start your multi-engine training</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-[var(--color-status-warning)]/10 border border-[var(--color-status-warning)]/20 text-sm text-[var(--color-status-warning)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2.5 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

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
              className="w-full px-3 py-2.5 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
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
              placeholder="Min. 6 characters"
              required
              className="w-full px-3 py-2.5 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-3 py-2.5 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-[var(--color-gold)] text-[var(--color-surface-base)] font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)"
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-gold)] font-medium hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
