export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex bg-[var(--color-surface-base)]">
      {/* Left panel — DA42 hero area */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[var(--color-surface-sunken)]">
        {/* Background image placeholder — replace with actual DA42 photo at public/aircraft/da42-hero.jpg */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/aircraft/da42-hero.jpg')" }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[var(--color-gold-dim)] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[var(--color-gold)]">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--color-gold)]">DA42-VI</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] leading-tight tracking-tight mb-3">
              Multi-Engine<br />Ground School
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
              Complete training program for the Diamond DA42-VI twin-engine aircraft. 20 modules covering aerodynamics, systems, and procedures.
            </p>
            <div className="flex gap-6">
              <div>
                <span className="block text-2xl font-bold font-mono text-[var(--color-text-primary)]">20</span>
                <span className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">Modules</span>
              </div>
              <div className="w-px bg-[var(--color-border-default)]" />
              <div>
                <span className="block text-2xl font-bold font-mono text-[var(--color-text-primary)]">131</span>
                <span className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">Pages</span>
              </div>
              <div className="w-px bg-[var(--color-border-default)]" />
              <div>
                <span className="block text-2xl font-bold font-mono text-[var(--color-text-primary)]">5+</span>
                <span className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">Quizzes</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--color-text-faint)]">
            Based on the ERAU Multi-Engine Airplane Guide
          </p>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
