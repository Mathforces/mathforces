import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
      const {username, email, password } = formData;
    if (!formData || !username || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createSupabaseServerClient();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await (await supabaseClient).auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

   axios.post('/api/auth/signup/create_profile', {id:authData.user.id, username: username, email: email}).then((res) => {
    if(!res || !res.data.success){
      return new Response(
        JSON.stringify({ error: "Failed to create profile, sign up" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
   }) 
    
    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
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
