import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;

  const { data, error } = await supabase
    .from("submissions")
    .select("*, problems(name), profiles(username)")
    .eq("problem_id", problemId);

  const err = handleSupabaseError(error, "submissions");
  if (err) return err;

  return json(data);
}
