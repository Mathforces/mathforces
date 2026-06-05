import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  json,
  apiError,
  handleSupabaseError,
  requireFields,
} from "@/lib/api/response";

const numericAnswerPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const DECIMAL_ANSWER_TOLERANCE = 0.01;

function isNumericAnswer(answer: string): boolean {
  return numericAnswerPattern.test(answer.trim());
}

function computeStatus(userAnswer: string, correctAnswer: string): "success" | "failure" {
  const normalizedUserAnswer = userAnswer.trim();
  const normalizedCorrectAnswer = correctAnswer.trim();

  if (
    isNumericAnswer(normalizedUserAnswer) &&
    isNumericAnswer(normalizedCorrectAnswer)
  ) {
    const userNumber = Number(normalizedUserAnswer);
    const correctNumber = Number(normalizedCorrectAnswer);

    if (userNumber === correctNumber) return "success";
    if (Number.isInteger(correctNumber)) return "failure";

    const difference = Math.abs(userNumber - correctNumber);
    return difference <= DECIMAL_ANSWER_TOLERANCE + Number.EPSILON
      ? "success"
      : "failure";
  }

  return normalizedUserAnswer === normalizedCorrectAnswer ? "success" : "failure";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const { problem_id, user_id } = await params;

  const { data, error } = await supabase
    .from("submissions")
    .select("*, profiles(username), problems(name)")
    .eq("problem_id", problem_id)
    .eq("user_id", user_id);

  const err = handleSupabaseError(error, "user submissions");
  if (err) return err;

  return json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const body = await request.json();
  const { problem_id, user_id } = await params;

  const missingFields = requireFields(body, [
    "user_answer",
    "display_id",
  ]);
  if (missingFields) return missingFields;

  const authSupabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await authSupabase.auth.getUser();

  if (userError || !user) {
    return apiError("You must be signed in to submit", 401);
  }
  if (user.id !== user_id) {
    return apiError("You can only submit as the signed-in user", 403);
  }

  const supabase = createSupabaseServiceClient();

  // Fetch problem with its contest to check live contest rules
  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id, answer, contest_id, contests(mode, start_date, end_date)")
    .eq("id", problem_id)
    .single();

  if (problemError || !problem) {
    return apiError("Problem not found", 404);
  }

  const contestData = problem.contests as
    | { mode: string | null; start_date: string; end_date: string }
    | { mode: string | null; start_date: string; end_date: string }[]
    | null;
  const contest = Array.isArray(contestData)
    ? (contestData[0] ?? null)
    : contestData;

  // Live contest enforcement
  if (contest?.mode === "live") {
    const now = new Date();
    const startDate = new Date(contest.start_date);
    const endDate = new Date(contest.end_date);

    if (now < startDate) {
      return apiError("This contest has not started yet", 403);
    }

    if (now >= endDate) {
      return apiError("This contest has ended. Submissions are closed.", 410);
    }

    // Check registration
    const { data: registration } = await supabase
      .from("registered_in_contest")
      .select("user_id")
      .eq("contest_id", problem.contest_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (!registration) {
      return apiError("You must be registered in this contest to submit", 403);
    }
  }

  // Server-side answer checking — ignore client-provided status
  const correctAnswer = problem.answer;
  const status = correctAnswer
    ? computeStatus(body.user_answer, correctAnswer)
    : "failure";

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id,
      problem_id,
      user_answer: body.user_answer,
      status,
      display_id: body.display_id,
    })
    .select("*, profiles(username), problems(name)")
    .single();

  if (error) return apiError(error.message, 500);

  const [
    { count: submissionCount, error: submissionCountError },
    { count: correctSubmissionCount, error: correctSubmissionCountError },
  ] = await Promise.all([
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id)
      .eq("status", "success"),
  ]);

  if (submissionCountError) return apiError(submissionCountError.message, 500);
  if (correctSubmissionCountError) {
    return apiError(correctSubmissionCountError.message, 500);
  }

  const { error: updateProblemError } = await supabase
    .from("problems")
    .update({
      submission_count: submissionCount ?? 0,
      correct_submission_count: correctSubmissionCount ?? 0,
    })
    .eq("id", problem_id);

  if (updateProblemError) return apiError(updateProblemError.message, 500);

  return json({ success: true, data }, 201);
}
