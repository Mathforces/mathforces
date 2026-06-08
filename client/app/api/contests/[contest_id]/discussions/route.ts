import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .eq("contest_id", parseInt(contestId));

  const err = handleSupabaseError(error, "contest discussions");
  if (err) return err;

  return json(data);
}
