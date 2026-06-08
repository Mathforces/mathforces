import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> }
) {
  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const problemId = (await params).problem_id;
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const { data, error } = await supabase
    .from("problems")
    .select("description_latex, contest_id, contests(id, mode, start_date, end_date)")
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem description");
  if (err) return err;
  if (!data) return apiError("Problem not found", 404);

  const contest = Array.isArray(data.contests) ? data.contests[0] : data.contests;
  if (contest) {
    const accessError = await requireContestAccess({
      supabase,
      contest,
      userId: user?.id,
    });
    if (accessError) return accessError;
  }

  return json({ description_latex: data.description_latex });
}
