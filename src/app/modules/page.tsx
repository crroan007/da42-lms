import Link from "next/link";
import { getAllModules } from "@/lib/content/modules";
import { Clock, BookOpen } from "lucide-react";

export default function ModulesPage() {
  const modules = getAllModules();
  const displayModules = modules;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Training Modules</h1>
        <p className="text-text-secondary text-sm mt-0.5">Complete each module in sequence to master the DA42-VI</p>
      </div>

      <div className="panel overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-14">#</th>
              <th>Module</th>
              <th className="hidden sm:table-cell w-24">Duration</th>
              <th className="hidden sm:table-cell w-24">Sections</th>
              <th className="w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayModules.map((mod, i) => (
              <tr key={mod.slug}>
                <td>
                  <span className="font-mono font-semibold text-gold text-xs">
                    {String(mod.orderIndex || i + 1).padStart(2, "0")}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/modules/${mod.slug}`}
                    className="text-text-primary hover:text-gold transition-colors font-medium"
                  >
                    {mod.title}
                  </Link>
                  <p className="text-text-muted text-xs mt-0.5 truncate max-w-md">
                    {mod.description || "Module content"}
                  </p>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{mod.estimatedMinutes || 10}</span> min
                  </span>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <BookOpen className="h-3 w-3" />
                    <span className="font-mono">{mod.subsections?.length || 0}</span>
                  </span>
                </td>
                <td>
                  <span className="label-caps text-text-faint">Locked</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
