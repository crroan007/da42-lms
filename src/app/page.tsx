import Link from "next/link";
import { getAllModules } from "@/lib/content/modules";
import { BookOpen, Clock, ChevronRight, Plane, Target, Award } from "lucide-react";

export default function DashboardPage() {
  const modules = getAllModules();
  const totalModules = modules.length || 20;
  const completedModules = 0; // Will be dynamic with Supabase
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-1">
          <Plane className="h-4 w-4 text-gold" />
          <span className="label-caps text-gold">Diamond DA42-VI</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          Multi-Engine Training
        </h1>
        <p className="text-text-secondary text-sm max-w-xl">
          Master the Diamond DA42-VI twin-engine aircraft. Complete all {totalModules} training modules covering aerodynamics, systems, and procedures.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="panel p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-gold-dim">
            <Target className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">{progressPercent}%</p>
            <p className="label-caps">Course Progress</p>
          </div>
        </div>
        <div className="panel p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-status-advisory/10">
            <BookOpen className="h-5 w-5 text-status-advisory" />
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">{completedModules}/{totalModules}</p>
            <p className="label-caps">Modules Complete</p>
          </div>
        </div>
        <div className="panel p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-status-operational/10">
            <Award className="h-5 w-5 text-status-operational" />
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">--</p>
            <p className="label-caps">Avg Quiz Score</p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="label-caps text-text-muted">Training Modules</h2>
          <Link href="/modules" className="flex items-center gap-1 text-sm text-gold hover:text-gold-muted transition-colors">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.slice(0, 6).map((mod, i) => (
            <Link
              key={mod.slug || i}
              href={`/modules/${mod.slug}`}
              className="panel accent-strip-top p-4 transition-lift group block"
              data-status="locked"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-surface-overlay text-xs font-mono font-semibold text-gold">
                  {String(mod.orderIndex || i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono">{mod.estimatedMinutes || "~10"}</span> min
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors mb-1">
                {mod.title}
              </h3>
              <p className="text-xs text-text-secondary line-clamp-2">
                {mod.description || "Loading content..."}
              </p>
              <div className="mt-3 h-1 rounded-sm bg-surface-overlay">
                <div className="h-full rounded-sm bg-gold-muted" style={{ width: "0%" }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
