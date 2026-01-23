import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {username} = body;
    if (!username || username.length < 2) {
      return NextResponse.json({ error: "Invalid username input" }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    const { data: username_matches, error: usernameError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", body.username)
    if (usernameError) {
      return NextResponse.json({ error: usernameError.message }, { status: 500 });
    }
    if (username_matches.length > 0) {
      return NextResponse.json({ exists: true });
    }
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
