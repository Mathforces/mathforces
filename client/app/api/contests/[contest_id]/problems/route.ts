import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contestProblemDefaultValues } from "@/types/types";
import { json, handleSupabaseError } from "@/lib/api/response";

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
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

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
