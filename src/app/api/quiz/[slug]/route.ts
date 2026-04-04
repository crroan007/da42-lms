import { NextResponse } from "next/server";
import { getQuizByModuleSlug } from "@/lib/content/quizzes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const questions = getQuizByModuleSlug(slug);
  return NextResponse.json({ questions });
}
