import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .eq("id", contestId)
    .single();

  const err = handleSupabaseError(error, "contest");
  if (err) return err;

  return json(data);
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
