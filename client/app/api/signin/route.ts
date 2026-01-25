import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (!formData || !formData.usernameOrEmail || !formData.password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isEmail = (txt: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(txt);
    }
    const supabaseService = createSupabaseServiceClient();
    const getEmailFromUsername = async(txt: string) => {
        const { data, error } = await supabaseService
          .from("profiles")
          .select("email")
          .eq("username", txt)
          .single();

        if (error) {
          console.error("Error fetching email:", error);
          return null;
        }

        return data?.email || null;
    }
    const email = isEmail(formData.usernameOrEmail) ? formData.usernameOrEmail : (await getEmailFromUsername(formData.usernameOrEmail));

    if (!email) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const {data: signinData, error: signinError} =  await supabaseService.auth.signInWithPassword({
        email: email, 
        password: formData.password
    })
    if (signinError) {
      console.error("Sign in Error: ", signinError);
       
      return new Response(
        JSON.stringify({ error: signinError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, user: signinData.user }), {
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
