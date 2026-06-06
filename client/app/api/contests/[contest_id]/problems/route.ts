import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { contestProblemDefaultValues } from "@/types/types";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

type ContestProblemRow = {
  id: string;
  submission_count: number | null;
  correct_submission_count: number | null;
};

type SubmissionCountRow = {
  problem_id: string;
  status: string | null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> },
) {
  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const contestId = (await params).contest_id;
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select("id, mode, start_date, end_date")
    .eq("id", contestId)
    .single();

  const contestErr = handleSupabaseError(contestError, "contest");
  if (contestErr) return contestErr;
  if (!contest) return apiError("Contest not found", 404);

  const accessError = await requireContestAccess({
    supabase,
    contest,
    userId: user?.id,
  });
  if (accessError) return accessError;

  const { data, error } = await supabase
    .from("problems")
    .select(Object.keys(contestProblemDefaultValues).join(", "))
    .eq("contest_id", contestId)
    .order("index_in_contest", { ascending: true });

  const err = handleSupabaseError(error, "contest problems");
  if (err) return err;

  const problems = (data ?? []) as unknown as ContestProblemRow[];

  if (problems.length === 0) {
    return json([]);
  }

  const problemIds = problems.map((problem: ContestProblemRow) => problem.id);
  const { data: submissionsData, error: submissionsError } = await supabase
    .from("submissions")
    .select("problem_id, status")
    .in("problem_id", problemIds);

  const submissionsErr = handleSupabaseError(
    submissionsError,
    "contest problem submission counts",
  );
  if (submissionsErr) return submissionsErr;

  const submissions = (submissionsData ?? []) as SubmissionCountRow[];

  const countsByProblem = new Map<
    string,
    { submission_count: number; correct_submission_count: number }
  >();

  for (const submission of submissions) {
    const current = countsByProblem.get(submission.problem_id) ?? {
      submission_count: 0,
      correct_submission_count: 0,
    };

    current.submission_count += 1;
    if (submission.status === "success") {
      current.correct_submission_count += 1;
    }
    countsByProblem.set(submission.problem_id, current);
  }

  const problemsWithCounts = problems.map((problem: ContestProblemRow) => {
    const counts = countsByProblem.get(problem.id);

    return {
      ...problem,
      submission_count: counts?.submission_count ?? 0,
      correct_submission_count: counts?.correct_submission_count ?? 0,
    };
  });

  return json(problemsWithCounts);
}
