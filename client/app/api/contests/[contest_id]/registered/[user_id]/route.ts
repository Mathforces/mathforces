import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string, user_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { contest_id, user_id } = await params;

  const { data, error } = await supabase
    .from("registered_in_contest")
    .select("*, profiles(name)")
    .eq("contest_id", contest_id)
    .eq("user_id", user_id);

  const err = handleSupabaseError(error, "check registration");
  if (err) return err;

  return json({ exists: true, data });
}

