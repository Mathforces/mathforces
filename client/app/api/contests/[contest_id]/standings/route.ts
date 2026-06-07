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
    .select("user_id, problem_id, score, created_at")
    .in("user_id", userIds);

  const submissionsErr = handleSupabaseError(submissionsError, "submissions");
  if (submissionsErr) return submissionsErr;

  const submissionsByUser: Record<string, Record<string, { score: number; created_at: string }>> = {};
  for (const sub of (submissionsData ?? []) as Array<Record<string, unknown>>) {
    const uid = sub.user_id as string;
    const pid = sub.problem_id as string;
    const score = sub.score as number;
    const created_at = sub.created_at as string;
    if (!submissionsByUser[uid]) submissionsByUser[uid] = {};
    const existing = submissionsByUser[uid][pid];
    if (!existing || score > existing.score) {
      submissionsByUser[uid][pid] = { score, created_at };
    }
  }

  const standings: Standing[] = (standingsData ?? []).map((s: Record<string, unknown>) => {
    const profiles = s.profiles as { username: string; elo_rating: number } | null;
    return {
      id: s.id as string | undefined,
      user_id: s.user_id as string | undefined,
      contest_id: s.contest_id as string | undefined,
      score: s.score as number | undefined,
      penalty: s.penalty as number | undefined,
      elo_rating: profiles?.elo_rating ?? undefined,
      problem_scores: submissionsByUser[s.user_id as string] ?? {},
      profiles: {
        username: profiles?.username ?? "UNKNOWN",
      },
    };
  });

  standings.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return json(standings);
}
