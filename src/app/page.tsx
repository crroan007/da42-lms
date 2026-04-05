import Link from "next/link";
import { getAllModules } from "@/lib/content/modules";
import { ChevronRight, Plane } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardModules } from "@/components/dashboard/DashboardModules";

export default function DashboardPage() {
  const modules = getAllModules();
  const totalModules = modules.length;

  const moduleData = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    orderIndex: m.orderIndex,
    description: m.description,
    estimatedMinutes: m.estimatedMinutes,
  }));

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

      {/* Live Stats */}
      <DashboardStats totalModules={totalModules} />

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="label-caps text-text-muted">Training Modules</h2>
          <Link href="/modules" className="flex items-center gap-1 text-sm text-gold hover:text-gold-muted transition-colors">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <DashboardModules modules={moduleData} />
      </div>
    </div>
  );
}
