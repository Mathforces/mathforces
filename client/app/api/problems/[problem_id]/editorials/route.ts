import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> }
) {
  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const problemId = (await params).problem_id;
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id, contest_id, contests(id, mode, start_date, end_date)")
    .eq("id", problemId)
    .single();

  const problemErr = handleSupabaseError(problemError, "problem");
  if (problemErr) return problemErr;
  if (!problem) return apiError("Problem not found", 404);

  const contest = Array.isArray(problem.contests)
    ? problem.contests[0]
    : problem.contests;
  if (contest) {
    const accessError = await requireContestAccess({
      supabase,
      contest,
      userId: user?.id,
    });
    if (accessError) return accessError;
  }

  const { data, error } = await supabase
    .from("editorials")
    .select("*")
    .eq("problem_id", parseInt(problemId));

  const err = handleSupabaseError(error, "editorials");
  if (err) return err;

  return json(data);
}
