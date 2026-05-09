import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { rateLimitPublic } from "@/lib/api/auth";
import {
  json,
  apiError,
  handleSupabaseError,
  paginate,
  parsePaginationParams,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 2);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .order("start_date", { ascending: false })
    .lte("start_date", (pointer ? new Date(pointer) : new Date()).toISOString())
    .limit(limit + 1);

  const err = handleSupabaseError(error, "contests");
  if (err) return err;

  return json(paginate(data, limit, "start_date"));
}

export async function POST(request: Request) {
  // const authError = protectApiEndpoint(request);
  // if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();
  const problems = Array.isArray(body.problems) ? body.problems : [];
  const contestPayload = {
    name: body.name,
    description: body.description ?? "",
    difficulty: Number(body.difficulty),
    start_date: body.start_date,
    end_date: body.end_date,
    length_in_minutes: Number(body.length_in_minutes),
    problem_count: problems.length,
  };

  if (!contestPayload.name) return apiError("Contest name is required", 400);
  if (!Number.isFinite(contestPayload.difficulty)) {
    return apiError("Contest difficulty must be a number", 400);
  }
  if (!contestPayload.start_date || !contestPayload.end_date) {
    return apiError("Contest start and end dates are required", 400);
  }

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .insert([contestPayload])
    .select()
    .single();

  if (contestError) return apiError(contestError.message, 500);

  if (problems.length === 0) {
    return json({ contest, problems: [] }, 201);
  }

  const problemPayloads = problems.map(
    (problem: Record<string, unknown>, index: number) => {
      const name = typeof problem.name === "string" ? problem.name : null;

      return {
        id: typeof problem.id === "string" ? problem.id : undefined,
        contest_id: contest.id,
        name,
        full_name: name,
        submission_count: Number(problem.submission_count ?? 0),
        correct_submission_count: Number(problem.correct_submission_count ?? 0),
        points:
          problem.points === null || problem.points === undefined
            ? null
            : Number(problem.points),
        difficulty:
          problem.difficulty === null || problem.difficulty === undefined
            ? null
            : Number(problem.difficulty),
        likes_count: 0,
        comments_count: 0,
        tags: Array.isArray(problem.tags) ? problem.tags : null,
        description_latex:
          typeof problem.description_latex === "string"
            ? problem.description_latex
            : null,
        description_html:
          typeof problem.description_html === "string"
            ? problem.description_html
            : null,
        answer: typeof problem.answer === "string" ? problem.answer : null,
        official_editorial:
          typeof problem.editorial === "string" ? problem.editorial : "",
        index_in_contest: index,
      };
    },
  );

  const { data: insertedProblems, error: problemsError } = await supabase
    .from("problems")
    .insert(problemPayloads)
    .select();

  if (problemsError) {
    await supabase.from("contests").delete().eq("id", contest.id);
    return apiError(problemsError.message, 500);
  }

  return json({ contest, problems: insertedProblems ?? [] }, 201);
}
