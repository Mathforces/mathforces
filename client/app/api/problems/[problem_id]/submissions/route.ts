import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const problemId = (await params).problem_id;
  const url = new URL(request.url);
  const contestId = url.searchParams.get("contest_id");
  const officialOnly = url.searchParams.get("official_only") === "true";

  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  let isLive = false;
  if (contestId) {
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("id, mode, start_date, end_date")
      .eq("id", contestId)
      .single();

    if (!contestError && contest) {
      // Gate access for live contests (must be registered)
      const accessError = await requireContestAccess({
        supabase,
        contest,
        userId: user?.id,
      });
      if (accessError) return accessError;

      if (contest.mode === "live") {
        const now = new Date();
        const startDate = new Date(contest.start_date);
        const endDate = new Date(contest.end_date);
        isLive = now >= startDate && now < endDate;
      }
    }
  }

  let query = supabase
    .from("submissions")
    .select(
      isLive
        ? "id, created_at, problem_id, user_id, display_id, status, score, is_official, user_answer, profiles(username), problems(name)"
        : "*, profiles(username), problems(name)",
    )
    .eq("problem_id", problemId);

  if (officialOnly) {
    query = query.eq("is_official", true);
  }

  const { data, error } = await query;

  const err = handleSupabaseError(error, "submissions");
  if (err) return err;

  return json(data);
}
