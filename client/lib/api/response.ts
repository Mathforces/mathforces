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

export function handleSupabaseError(error: { message: string } | null, context: string): Response | null {
  if (error) {
    console.error(`Supabase error in ${context}:`, error.message);
    return apiError(error.message, 500);
  }
  return null;
}

export function requireFields(body: unknown, fields: string[]): Response | null {
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
    error instanceof Error ? error.message : "Internal server error"
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
  pointerField: keyof T
): PaginatedResult<T> {
  const safeData = data ?? [];
  const hasMore = safeData.length > limit;
  const result = safeData.slice(0, hasMore ? limit : safeData.length);
  const nextPointer = result.length > 0 ? String(result[result.length - 1][pointerField]) : null;
  return { data: result, hasMore, nextPointer };
}

export function parsePaginationParams(url: string, defaultLimit = 20) {
  const { searchParams } = new URL(url);
  let limit = Number(searchParams.get("limit") ?? 0) || defaultLimit;
  const pointer = searchParams.get("pointer");
  return { limit, pointer };
}
