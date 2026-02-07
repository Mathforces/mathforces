import { createSupabaseServerClient } from "@/lib/supabase/server";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string, user_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const contestId = (await params).contest_id;
    const user_id = (await params).user_id;
    const { data: registeredIncontest, error } = await supabase
      .from("registered_in_contest")
      .select("*, profiles(name)")
      .eq("contest_id", contestId)
      .eq("user_id", user_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message, exists: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({exists: true, registeredIncontest}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" , exists: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

