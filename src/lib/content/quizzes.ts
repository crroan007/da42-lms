import fs from "fs";
import path from "path";
import type { QuizQuestion } from "@/types";

const QUIZ_DIR = path.join(process.cwd(), "content", "quizzes");

export function getQuizByModuleSlug(slug: string): QuizQuestion[] {
  const filePath = path.join(QUIZ_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.questions;
}
