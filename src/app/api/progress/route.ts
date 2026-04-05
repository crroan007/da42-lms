import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — fetch all progress for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("module_slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}

// POST — upsert progress for a module
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { moduleSlug, status, quizScore, quizTotal } = body;

  if (!moduleSlug) {
    return NextResponse.json({ error: "moduleSlug required" }, { status: 400 });
  }

  const upsertData: Record<string, unknown> = {
    user_id: user.id,
    module_slug: moduleSlug,
  };

  if (status) upsertData.status = status;
  if (quizScore !== undefined) upsertData.quiz_score = quizScore;
  if (quizTotal !== undefined) upsertData.quiz_total = quizTotal;
  if (status === "completed") upsertData.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(upsertData, { onConflict: "user_id,module_slug" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
