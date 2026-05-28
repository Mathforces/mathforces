import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  json,
  handleSupabaseError,
  parseOffsetParams,
  parseFilterParams,
  parseSortParams,
  paginateOffset,
} from "@/lib/api/response";

type ProblemFilters = Record<string, string | string[]>;
type ProblemListRow = {
  id: string;
  submission_count: number | null;
  correct_submission_count: number | null;
};
type SubmissionCountRow = {
  problem_id: string;
  status: string | null;
};

type SortableFields =
  | "name"
  | "difficulty"
  | "submission_count"
  | "likes_count"
  | "created_at";

const VALID_SORT_FIELDS: SortableFields[] = [
  "name",
  "difficulty",
  "submission_count",
  "likes_count",
  "created_at",
];

function parseSearchTerms(searchTerm: string) {
  return searchTerm
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 0);
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();

  const { page, limit, offset } = parseOffsetParams(request.url, 50);
  const filters = parseFilterParams<ProblemFilters>(request.url, [
    "search",
    "difficulty_min",
    "difficulty_max",
    "tags",
  ]);
  const { sortBy, sortOrder } = parseSortParams(request.url);

  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy as SortableFields)
    ? (sortBy as SortableFields)
    : "created_at";

  let query = supabase
    .from("problems")
    .select(
      "id, name, contest_id, full_name, tags, submission_count, correct_submission_count, points, difficulty, likes_count, created_at, contests(name)",
      { count: "exact" },
    );

  if (filters.search) {
    const terms = parseSearchTerms(filters.search as string);

    for (const term of terms) {
      const { data: matchingContests, error: matchingContestsError } =
        await supabase
          .from("contests")
          .select("id")
          .ilike("name", `%${term}%`);

      const contestErr = handleSupabaseError(
        matchingContestsError,
        "problem search contests",
      );
      if (contestErr) return contestErr;

      const contestIds = (matchingContests ?? []).map((contest) => contest.id);
      const filtersForTerm = [
        `name.ilike.%${term}%`,
        `full_name.ilike.%${term}%`,
      ];

      if (contestIds.length > 0) {
        filtersForTerm.push(`contest_id.in.(${contestIds.join(",")})`);
      }

      query = query.or(filtersForTerm.join(","));
    }
  }

  if (filters.difficulty_min) {
    query = query.gte("difficulty", Number(filters.difficulty_min));
  }

  if (filters.difficulty_max) {
    query = query.lte("difficulty", Number(filters.difficulty_max));
  }

  if (filters.tags) {
    const tagString = Array.isArray(filters.tags)
      ? filters.tags[0]
      : filters.tags;
    const tagList = tagString.split(",").map((t: string) => t.trim());
    query = query.overlaps("tags", tagList);
  }

  const { data, error, count } = await query
    .order(safeSortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  const err = handleSupabaseError(error, "problems");
  if (err) return err;

  const total = count ?? 0;
  const pagination = paginateOffset(page, limit, total);
  const problems = (data ?? []) as ProblemListRow[];

  if (problems.length === 0) {
    return json({
      data: [],
      pagination,
    });
  }

  const problemIds = problems.map((problem: ProblemListRow) => problem.id);
  const { data: submissionsData, error: submissionsError } = await supabase
    .from("submissions")
    .select("problem_id, status")
    .in("problem_id", problemIds);

  const submissionErr = handleSupabaseError(
    submissionsError,
    "problem submission counts",
  );
  if (submissionErr) return submissionErr;

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

  const dataWithCounts = problems.map((problem: ProblemListRow) => {
    const counts = countsByProblem.get(problem.id);

    return {
      ...problem,
      submission_count: counts?.submission_count ?? 0,
      correct_submission_count: counts?.correct_submission_count ?? 0,
    };
  });

  return json({
    data: dataWithCounts,
    pagination,
  });
}
