import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError, paginate, parsePaginationParams } from "@/lib/api/response";

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
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("contests")
    .insert([body])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data, 201);
}
