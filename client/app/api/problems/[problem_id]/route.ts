import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const problemId = (await params).problem_id;
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const { data, error } = await supabase
    .from("problems")
    .select(
      "id, name, contest_id, full_name, tags, submission_count, correct_submission_count, points, difficulty, likes_count, created_at, description_latex, description_html, index_in_contest, contests(id, mode, start_date, end_date)",
    )
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem");
  if (err) return err;
  if (!data) return apiError("Problem not found", 404);

  const contest = Array.isArray(data.contests) ? data.contests[0] : data.contests;
  if (contest) {
    const accessError = await requireContestAccess({
      supabase,
      contest,
      userId: user?.id,
    });
    if (accessError) return accessError;
  }

  return json(data);
}

export async function POST(request: Request) {
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("problems")
    .insert([body])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data, 201);
}
