import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, handleSupabaseError, requireFields } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const { problem_id, user_id } = await params;

  const { data, error } = await supabase
    .from("submissions")
    .select("*, problems(name), profiles(username)")
    .eq("problem_id", problem_id)
    .eq("user_id", user_id);

  const err = handleSupabaseError(error, "user submissions");
  if (err) return err;

  return json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const body = await request.json();
  const { problem_id, user_id } = await params;

  const missingFields = requireFields(body, ["user_answer", "status", "display_id"]);
  if (missingFields) return missingFields;

  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id,
      problem_id,
      user_answer: body.user_answer,
      status: body.status,
      display_id: body.display_id,
    })
    .select("*, problems(name), profiles(username)")
    .single();

  if (error) return apiError(error.message, 500);

  return json({ success: true, data }, 201);
}
