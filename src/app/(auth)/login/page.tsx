import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      {/* Mobile-only branding (hidden on lg where left panel shows it) */}
      <div className="lg:hidden text-center mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">DA42-VI Training</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Multi-Engine Ground School</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Sign in</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">Access your training dashboard</p>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="pilot@example.com"
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
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
              <input type="checkbox" className="rounded-sm border-[var(--color-border-default)] bg-[var(--color-surface-sunken)] accent-[var(--color-gold)]" />
              Remember me
            </label>
            <a href="#" className="text-sm text-[var(--color-gold)] hover:opacity-80 transition-opacity">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded bg-[var(--color-gold)] text-[var(--color-surface-base)] font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)"
            }}
          >
            Sign In
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
