import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="data-value text-6xl text-[var(--color-text-faint)] mb-4">404</span>
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Page Not Found</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        The requested page could not be located.
      </p>
      <Link
        href="/"
        className="px-4 py-2 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-surface-base)] transition-colors hover:opacity-90"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
