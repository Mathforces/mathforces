import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.provider) return apiError("Missing required field: provider", 400);

  const supabaseServer = createSupabaseServerClient();

  const { data, error } = await (
    await supabaseServer
  ).auth.signInWithOAuth({
    provider: body.provider,
  });

  if (error) return apiError(error.message, 500);

  return json({ success: true, url: data.url }, 201);
}
