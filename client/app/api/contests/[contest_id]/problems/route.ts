import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contestProblemDefaultValues } from "@/types/types";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("problems")
    .select(Object.keys(contestProblemDefaultValues).join(", "))
    .eq("contest_id", contestId)
    .order("index_in_contest", { ascending: true });

  const err = handleSupabaseError(error, "contest problems");
  if (err) return err;

  return json(data);
}
