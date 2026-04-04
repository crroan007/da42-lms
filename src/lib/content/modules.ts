import fs from "fs";
import path from "path";
import type { Module } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "modules");

export function getAllModules(): Module[] {
  const indexPath = path.join(CONTENT_DIR, "index.json");
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return index.modules.map((entry: { slug: string }) => {
    const filePath = path.join(CONTENT_DIR, `${entry.slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // Normalize: some rewritten modules use "lessons" instead of "subsections"
    if (data.lessons && !data.subsections) {
      data.subsections = data.lessons;
      delete data.lessons;
    }
    return data;
  }).filter(Boolean);
}

export function getModuleBySlug(slug: string): Module | null {
  const modules = getAllModules();
  return modules.find((m) => m.slug === slug) ?? null;
}

export function getAdjacentModules(slug: string): { prev: Module | null; next: Module | null } {
  const modules = getAllModules();
  const index = modules.findIndex((m) => m.slug === slug);
  return {
    prev: index > 0 ? modules[index - 1] : null,
    next: index < modules.length - 1 ? modules[index + 1] : null,
  };
}
