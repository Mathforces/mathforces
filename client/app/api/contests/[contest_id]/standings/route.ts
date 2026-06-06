import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Standing } from "@/types/types";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data: standingsData, error } = await supabase
    .from("standings")
    .select("*, profiles!inner(username, elo_rating)")
    .eq("contest_id", contestId);

  const err = handleSupabaseError(error, "standings");
  if (err) return err;

  if (!standingsData || standingsData.length === 0) {
    return json([]);
  }

  const userIds = standingsData
    .map((s: Record<string, unknown>) => s.user_id)
    .filter(Boolean) as string[];

  const { data: submissionsData, error: submissionsError } = await supabase
    .from("submissions")
    .select("user_id, problem_id, score")
    .in("user_id", userIds);

  const submissionsErr = handleSupabaseError(submissionsError, "submissions");
  if (submissionsErr) return submissionsErr;

  const submissionsByUser: Record<string, Record<string, number>> = {};
  for (const sub of (submissionsData ?? []) as Array<Record<string, unknown>>) {
    const uid = sub.user_id as string;
    const pid = sub.problem_id as string;
    const score = sub.score as number;
    if (!submissionsByUser[uid]) submissionsByUser[uid] = {};
    const existing = submissionsByUser[uid][pid] ?? 0;
    if (score > existing) {
      submissionsByUser[uid][pid] = score;
    }
  }

  const standings = (standingsData ?? []).map((s: Record<string, unknown>) => {
    const profiles = s.profiles as { username: string; elo_rating: number } | null;
    return {
      id: s.id,
      user_id: s.user_id,
      contest_id: s.contest_id,
      score: s.score,
      penalty: s.penalty,
      elo_rating: profiles?.elo_rating ?? null,
      problem_scores: submissionsByUser[s.user_id as string] ?? {},
      profiles: {
        username: profiles?.username ?? "UNKNOWN",
      },
    };
  });

  standings.sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0));

  return json(standings);
}
