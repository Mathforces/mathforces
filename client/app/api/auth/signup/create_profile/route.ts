import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) return apiError("Missing required fields", 400);

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert([body])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json({ success: true, data }, 201);
}
