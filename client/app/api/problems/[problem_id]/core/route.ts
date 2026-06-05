import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { rateLimitPublic } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> }
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const supabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;
  const url = new URL(request.url);
  const contestId = url.searchParams.get("contest_id");

  // For live contests, check registration and gating
  if (contestId) {
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("mode, start_date, end_date")
      .eq("id", contestId)
      .single();

    if (!contestError && contest && contest.mode === "live") {
      const now = new Date();
      const start = new Date(contest.start_date);
      const end = new Date(contest.end_date);

      // Before start: do not expose problem statements
      if (now < start) {
        return apiError("This contest has not started yet", 403);
      }

      // During contest: require registered signed-in user
      if (now >= start && now < end) {
        const authSupabase = await createSupabaseServerClient();
        const { data: { user }, error: userError } = await authSupabase.auth.getUser();

        if (userError || !user) {
          return apiError("You must be signed in to view this problem", 401);
        }

        const { data: registration } = await supabase
          .from("registered_in_contest")
          .select("user_id")
          .eq("contest_id", contestId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!registration) {
          return apiError("You must be registered in this contest to view problems", 403);
        }
      }
      // After end: allow read-only (already handled by submission gating)
    }
  }

  const { data, error } = await supabase
    .from("problems")
    .select("id, name, description_latex") // answer removed — now computed server-side only
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem core");
  if (err) return err;

  return json(data);
}
