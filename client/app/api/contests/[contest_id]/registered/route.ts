import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { getContestPhase } from "@/lib/contest";

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
  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const body = await request.json();
  const contestId = (await params).contest_id;
  const {
    data: { user },
    error: userError,
  } = await authSupabase.auth.getUser();

  if (userError || !user) {
    return apiError("You must be signed in to register", 401);
  }
  if (body.user_id && body.user_id !== user.id) {
    return apiError("You can only register as the signed-in user", 403);
  }

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select("id, mode, start_date, end_date")
    .eq("id", contestId)
    .single();

  const contestErr = handleSupabaseError(contestError, "contest");
  if (contestErr) return contestErr;

  if (getContestPhase(contest) === "ended") {
    return apiError("This live contest has ended", 410);
  }

  const { data, error } = await supabase
    .from("registered_in_contest")
    .insert({ contest_id: contestId, user_id: user.id })
    .select();

  const err = handleSupabaseError(error, "register");
  if (err) return err;

  return json(data, 201);
}
