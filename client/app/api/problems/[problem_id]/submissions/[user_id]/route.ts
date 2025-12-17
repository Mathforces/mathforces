import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const problemId = (await params).problem_id;
    // TODO: Uncomment user_id filter when user authentication is implemented
    const userId = (await params).user_id;
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("problem_id", parseInt(problemId))
      // .eq("user_id", userId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(submissions), {
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