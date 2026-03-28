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

type SortableFields =
  | "name"
  | "difficulty"
  | "submissin_count"
  | "likes"
  | "created_at";

const VALID_SORT_FIELDS: SortableFields[] = [
  "name",
  "difficulty",
  "submissin_count",
  "likes",
  "created_at",
];

function buildSearchQuery(searchTerm: string): string {
  const terms = searchTerm
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (terms.length === 0) return "";

  return terms.map((term) => `${term}:*`).join(" & ");
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
      "id, name, full_name, tags, submission_count, correct_submission_count, points, difficulty, likes_count, created_at",
      { count: "exact" },
    );

  if (filters.search) {
    const searchQuery = buildSearchQuery(filters.search as string);
    if (searchQuery) {
      query = query.textSearch("full_name", searchQuery);
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

  return json({
    data: data ?? [],
    pagination,
  });
}
