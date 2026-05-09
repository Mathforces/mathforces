import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitPublic } from "@/lib/api/auth";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> }
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;

  const { data, error } = await supabase
    .from("problems")
    .select("id, name, description_latex, answer")
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem core");
  if (err) return err;

  return json(data);
}
