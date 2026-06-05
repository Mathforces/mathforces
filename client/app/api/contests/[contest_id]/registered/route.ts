import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("registered_in_contest")
    .select("*, profiles(name)")
    .eq("contest_id", contestId);

  const err = handleSupabaseError(error, "registered users");
  if (err) return err;

  return json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ contest_id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const contestId = (await params).contest_id;

  // Check if contest is live and has ended — reject registration
  const { data: contest } = await supabase
    .from("contests")
    .select("mode, end_date")
    .eq("id", contestId)
    .single();

  if (contest?.mode === "live") {
    const now = new Date();
    const endDate = new Date(contest.end_date);
    if (now >= endDate) {
      return apiError("This contest has already ended. Registration is closed.", 410);
    }
  }

  const serviceSupabase = createSupabaseServiceClient();
  const { data, error } = await serviceSupabase
    .from("registered_in_contest")
    .insert({ contest_id: contestId, user_id: body.user_id })
    .select();

  const err = handleSupabaseError(error, "register");
  if (err) return err;

  return json(data, 201);
}
