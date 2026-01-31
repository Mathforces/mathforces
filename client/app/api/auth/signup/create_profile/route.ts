import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    // const { id, username, email } = formData;
    // id, username, email
    if (!formData) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create profile
    const supabaseService = createSupabaseServiceClient();
    const { data: profileData, error: profileError } = await supabaseService
      .from("profiles")
      .insert([
       formData 
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);

      // TODO: Clean the user auth from users table

      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, profileData: profileData}),
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
