import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";

type SolvedSubmissionRow = {
  problem_id: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) return apiError(userError.message, 401);
  if (!user) return json({ solvedCount: 0 });

  const { data, error } = await supabase
    .from("submissions")
    .select("problem_id, problems!inner(contest_id)")
    .eq("user_id", user.id)
    .eq("status", "success")
    .eq("problems.contest_id", contestId);

  const err = handleSupabaseError(error, "contest solved count");
  if (err) return err;

  const solvedProblemIds = new Set(
    ((data ?? []) as SolvedSubmissionRow[]).map(
      (submission) => submission.problem_id,
    ),
  );

  return json({ solvedCount: solvedProblemIds.size });
}
