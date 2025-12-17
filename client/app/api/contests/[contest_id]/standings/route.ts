import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const contestId = (await params).contest_id;
    // TODO: ADD User Information in the select when profile table is created
    const { data: standings, error } = await supabase
      .from("standings")
      .select("*")
      .eq("contest_id", contestId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(standings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
