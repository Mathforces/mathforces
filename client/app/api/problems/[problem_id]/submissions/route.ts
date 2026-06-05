import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;
  const url = new URL(request.url);
  const contestId = url.searchParams.get("contest_id");

  let isLive = false;
  if (contestId) {
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("start_date, end_date")
      .eq("id", contestId)
      .single();

    if (!contestError && contest) {
      const now = new Date();
      const startDate = new Date(contest.start_date);
      const endDate = new Date(contest.end_date);
      isLive = now >= startDate && now < endDate;
    }
  }

  let query = supabase.from("submissions").select(
    isLive
      ? "id, created_at, problem_id, user_id, display_id, status, score, profiles(username), problems(name)"
      : "*, profiles(username), problems(name)",
  );

  const { data, error } = await query.eq("problem_id", problemId);

  const err = handleSupabaseError(error, "submissions");
  if (err) return err;

  return json(data);
}
