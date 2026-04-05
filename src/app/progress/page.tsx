import { getAllModules } from "@/lib/content/modules";
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";

export default function ProgressPage() {
  const modules = getAllModules();

  const moduleData = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    orderIndex: m.orderIndex,
    estimatedMinutes: m.estimatedMinutes,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Training Progress</h1>
        <p className="text-text-secondary text-sm mt-0.5">Track your journey through the DA42-VI curriculum</p>
      </div>
      <ProgressDashboard modules={moduleData} />
    </div>
  );
}
