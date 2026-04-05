import { getModuleBySlug, getAdjacentModules, getAllModules } from "@/lib/content/modules";
import { LessonList } from "@/components/modules/LessonList";
import { ModuleGate } from "@/components/modules/ModuleGate";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, BookOpen } from "lucide-react";

export function generateStaticParams() {
  const modules = getAllModules();
  if (modules.length === 0) return [];
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  const allModules = getAllModules();
  const allSlugs = allModules.map((m) => m.slug);

  if (!mod) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/modules" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </Link>
        <div className="panel p-6 text-center">
          <BookOpen className="h-10 w-10 text-text-faint mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-text-primary mb-1">Module Not Found</h1>
          <p className="text-text-secondary text-sm">This module content hasn&apos;t been loaded yet.</p>
        </div>
      </div>
    );
  }

  const { prev, next } = getAdjacentModules(slug);

  return (
    <ModuleGate orderIndex={mod.orderIndex} allSlugs={allSlugs}>
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/modules" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </Link>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-gold-dim text-xs font-mono font-semibold text-gold">
              {String(mod.orderIndex).padStart(2, "0")}
            </span>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">{mod.title}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3 w-3" /> <span className="font-mono">{mod.estimatedMinutes}</span> min
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <BookOpen className="h-3 w-3" /> <span className="font-mono">{mod.subsections.length}</span> sections
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-text-secondary">{mod.description}</p>
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LessonList sections={mod.subsections as any} />

        <div className="panel p-4 text-center">
          <h2 className="text-base font-semibold text-text-primary mb-1">Ready to test your knowledge?</h2>
          <p className="text-sm text-text-secondary mb-1">
            Score 100% to unlock the next module.
          </p>
          <Link
            href={`/modules/${mod.slug}/quiz`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded bg-gold text-surface-base font-semibold hover:opacity-90 transition-opacity"
          >
            Start Quiz
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2">
          {prev ? (
            <Link href={`/modules/${prev.slug}`} className="panel px-3 py-2 flex items-center gap-2 hover:border-border-strong transition-colors">
              <ChevronLeft className="h-4 w-4 text-gold" />
              <div>
                <p className="label-caps">Previous</p>
                <p className="text-sm text-text-primary">{prev.title}</p>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/modules/${next.slug}`} className="panel px-3 py-2 flex items-center gap-2 hover:border-border-strong transition-colors text-right">
              <div>
                <p className="label-caps">Next</p>
                <p className="text-sm text-text-primary">{next.title}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gold" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </ModuleGate>
  );
}
