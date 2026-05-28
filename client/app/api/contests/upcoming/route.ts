import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitPublic } from "@/lib/api/auth";
import {
  json,
  handleSupabaseError,
  parsePaginationParams,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 2);
  const offset = Math.max(0, Number(pointer ?? 0) || 0);
  const now = new Date().toISOString();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .order("start_date", { ascending: false })
    .order("id", { ascending: true })
    .gte("start_date", now)
    .range(offset, offset + limit);

  const err = handleSupabaseError(error, "upcoming contests");
  if (err) return err;

  const safeData = data ?? [];
  const hasMore = safeData.length > limit;
  return json({
    data: safeData.slice(0, limit),
    hasMore,
    nextPointer: hasMore ? String(offset + limit) : null,
  });
}
