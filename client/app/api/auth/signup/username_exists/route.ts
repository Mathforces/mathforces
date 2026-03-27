import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const body = await request.json();
  const { username } = body;

  if (!username || username.length < 2) {
    return apiError("Invalid username input", 400);
  }

  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username);

  if (error) return apiError(error.message, 500);

  return json({ exists: (data?.length ?? 0) > 0 });
}
