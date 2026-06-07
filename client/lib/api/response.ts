export const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

export function apiError(message: string, status = 500): Response {
  return json({ error: message }, status);
}

export function redirectToSignIn(request: Request): Response {
  const url = new URL(request.url);
  const redirectUrl = encodeURIComponent(url.pathname + url.search);
  return Response.redirect(new URL(`/sign_in?redirect_url=${redirectUrl}`, url), 302);
}

export function handleSupabaseError(
  error: { message: string } | null,
  context: string,
): Response | null {
  if (error) {
    console.error(`Supabase error in ${context}:`, error.message);
    return apiError(error.message, 500);
  }
  return null;
}

export function requireFields(
  body: unknown,
  fields: string[],
): Response | null {
  for (const field of fields) {
    if (!body || !(body as Record<string, unknown>)[field]) {
      return apiError(`Missing required field: ${field}`, 400);
    }
  }
  return null;
}

export function handleApiError(error: unknown, context: string): Response {
  console.error(`Error in ${context}:`, error);
  return apiError(
    error instanceof Error ? error.message : "Internal server error",
  );
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  nextPointer: string | null;
}

export function paginate<T extends Record<string, unknown>>(
  data: T[] | null,
  limit: number,
  pointerField: keyof T,
): PaginatedResult<T> {
  const safeData = data ?? [];
  const hasMore = safeData.length > limit;
  const result = safeData.slice(0, hasMore ? limit : safeData.length);
  const nextPointer =
    result.length > 0 ? String(result[result.length - 1][pointerField]) : null;
  return { data: result, hasMore, nextPointer };
}

export interface OffsetPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function paginateOffset(
  page: number,
  limit: number,
  total: number,
): OffsetPagination {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function parseOffsetParams(url: string, defaultLimit = 20) {
  const { searchParams } = new URL(url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(
    100,
    Math.max(
      1,
      Number(searchParams.get("limit") ?? defaultLimit) || defaultLimit,
    ),
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function parseFilterParams<T extends Record<string, string | string[]>>(
  url: string,
  filters: (keyof T)[],
): Record<string, string | string[]> {
  const { searchParams } = new URL(url);
  const result: Record<string, string | string[]> = {};

  for (const key of filters) {
    const value = searchParams.get(String(key));
    if (value) {
      result[String(key)] = value;
    }
  }

  return result;
}

export function parseSortParams(url: string) {
  const { searchParams } = new URL(url);
  const sortBy = searchParams.get("sort_by") || "created_at";
  const sortOrder = (searchParams.get("sort_order") ?? "desc").toLowerCase();
  return { sortBy, sortOrder };
}

export function parsePaginationParams(
  url: string,
  defaultLimit = 20,
  ...options: Record<string, any>[]
) {
  const { searchParams } = new URL(url);
  let limit = Number(searchParams.get("limit") ?? 0) || defaultLimit;
  const pointer = searchParams.get("pointer");
  let options_res: Record<string, any> = {};
  options.forEach((option) => {
    const optionValue =
      searchParams.get(option.name) ?? option.defaultValue ?? "";
    options_res[option.name] = optionValue;
  });
  return { limit, pointer, options: options_res };
}
