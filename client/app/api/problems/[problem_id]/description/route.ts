import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;

  const { data, error } = await supabase
    .from("problems")
    .select("description_html")
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem description");
  if (err) return err;

  return json(data);
}
