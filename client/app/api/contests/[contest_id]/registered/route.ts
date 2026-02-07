import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const contestId = (await params).contest_id;
    const { data: registeredIncontest, error } = await supabase
      .from("registered_in_contest")
      .select("*, profiles(name)")
      .eq("contest_id", contestId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(registeredIncontest), {
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

export async function POST(request: Request, { params }: { params: Promise<{ contest_id: string }> }) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { user_id } = body;
    const contest_id = (await params).contest_id;

    // When user doesn't exist add them 
    const { data: registered_users, error } = await supabase
      .from("registered_in_contest")
      .insert({ contest_id, user_id })
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }


    return new Response(JSON.stringify(registered_users), {
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
      }
    );
  }
}
