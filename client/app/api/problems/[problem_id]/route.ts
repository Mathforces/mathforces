import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;

  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", problemId);

  const err = handleSupabaseError(error, "problem");
  if (err) return err;

  return json(data);
}

export async function POST(request: Request) {
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("problems")
    .insert([body])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data, 201);
}
