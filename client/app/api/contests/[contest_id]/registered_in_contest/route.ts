import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("registered_in_contest")
    .select("*")
    .eq("contest_id", contestId);

  const err = handleSupabaseError(error, "registered_in_contest");
  if (err) return err;

  return json(data);
}
