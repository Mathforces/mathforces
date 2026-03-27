import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitPublic } from "@/lib/api/auth";
import { json, handleSupabaseError, paginate, parsePaginationParams } from "@/lib/api/response";

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 2);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .order("start_date", { ascending: false })
    .gte("start_date", (pointer ? new Date(pointer) : new Date()).toISOString())
    .limit(limit + 1);

  const err = handleSupabaseError(error, "upcoming contests");
  if (err) return err;

  return json(paginate(data, limit, "start_date"));
}
