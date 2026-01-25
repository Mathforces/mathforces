import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { provider } = formData;
    if (!formData || !provider) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabaseServer = createSupabaseServerClient();

    const { data: signinData, error: signinError } = await (
      await supabaseServer
    ).auth.signInWithOAuth({
      provider: provider,
    });

    if (signinError) {
      console.error("Sign in Error: ", signinError);

      return new Response(JSON.stringify({ error: signinError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ success: true, url: signinData.url }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
