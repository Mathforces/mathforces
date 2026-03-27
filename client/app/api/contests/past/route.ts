import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";

export async function GET(request: Request) {
  try {
    // Rate limit public GET requests
    const rateLimitError = rateLimitPublic(request);
    const { searchParams } = new URL(request.url);

    let limit = Number(searchParams.get("limit") ?? 0);
    if (!limit) limit = 2;
    let pointer = searchParams.get("pointer");
    console.log("limit: ", limit);

    if (rateLimitError) {
      return rateLimitError;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("contests")
      .select("*")
      .order("start_date", { ascending: false })
      .lte(
        "start_date",
        (pointer ? new Date(pointer) : new Date()).toISOString(),
      )
      .limit(limit + 1);

    if (error) {
      console.log("couldnt get pastContests1");
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const hasMore = data.length > Number(limit);
    const res = data.slice(0, data.length - 1);
    const nextPointer = res.length > 0 ? res[res.length - 1].start_date : null;
    console.log("next_pointer: ", nextPointer);
    return new Response(
      JSON.stringify({
        data: res,
        hasMore: hasMore,
        nextPointer: nextPointer,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.log("couldn't get pastContests");
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
