import { getAllModules } from "@/lib/content/modules";
import { ModuleTable } from "@/components/modules/ModuleTable";

export default function ModulesPage() {
  const modules = getAllModules();

  const moduleData = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    orderIndex: m.orderIndex,
    description: m.description,
    estimatedMinutes: m.estimatedMinutes,
    subsectionCount: m.subsections?.length || 0,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Training Modules</h1>
        <p className="text-text-secondary text-sm mt-0.5">Complete each module in sequence — 100% quiz score required to unlock the next</p>
      </div>
      <ModuleTable modules={moduleData} />
    </div>
  );
}
