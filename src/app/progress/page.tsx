import { getAllModules } from "@/lib/content/modules";
import { Circle, Clock } from "lucide-react";

export default function ProgressPage() {
  const modules = getAllModules();
  const displayModules = modules.length > 0 ? modules : Array.from({ length: 20 }, (_, i) => ({
    slug: `module-${i + 1}`,
    title: `Module ${i + 1}`,
    orderIndex: i + 1,
    estimatedMinutes: 15,
    description: "",
    subsections: [],
  }));

  const totalModules = displayModules.length;
  const completedModules = 0;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Training Progress</h1>
        <p className="text-text-secondary text-sm mt-0.5">Track your journey through the DA42-VI curriculum</p>
      </div>

      {/* Gauge */}
      <div className="panel p-6 flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-overlay" />
            <circle
              cx="50" cy="50" r="45" fill="none" stroke="var(--color-gold)" strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-text-primary font-mono">{progressPercent}%</span>
            <span className="label-caps mt-0.5">Complete</span>
          </div>
        </div>
        <div className="flex gap-8 mt-4 text-center">
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">{completedModules}</p>
            <p className="label-caps">Completed</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">{totalModules - completedModules}</p>
            <p className="label-caps">Remaining</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary font-mono">--</p>
            <p className="label-caps">Avg Score</p>
          </div>
        </div>
      </div>

      {/* Module checklist as data table */}
      <div className="panel overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle">
          <h2 className="label-caps">Module Checklist</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-14">#</th>
              <th>Module</th>
              <th className="w-24">Duration</th>
              <th className="w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayModules.map((mod, i) => (
              <tr key={mod.slug}>
                <td>
                  <span className="font-mono text-xs text-gold-muted">{String(i + 1).padStart(2, "0")}</span>
                </td>
                <td className="text-text-secondary text-sm">{mod.title}</td>
                <td>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{mod.estimatedMinutes}</span> min
                  </span>
                </td>
                <td>
                  <Circle className="h-3.5 w-3.5 text-text-faint" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
