import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, requireFields } from "@/lib/api/response";

export async function POST(request: Request) {
  const body = await request.json();
  const missingFields = requireFields(body, ["usernameOrEmail", "password"]);
  if (missingFields) return missingFields;

  const isEmail = (txt: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt);

  const supabaseService = createSupabaseServiceClient();
  const getEmailFromUsername = async (txt: string) => {
    const { data, error } = await supabaseService
      .from("profiles")
      .select("email")
      .eq("username", txt)
      .single();

    if (error) return null;
    return data?.email || null;
  };

  const email = isEmail(body.usernameOrEmail)
    ? body.usernameOrEmail
    : await getEmailFromUsername(body.usernameOrEmail);

  if (!email) return apiError("User not found", 404);

  const supabase = await createSupabaseServerClient();
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email,
    password: body.password,
  });

  if (signinError) return apiError(signinError.message, 500);

  return json({ success: true, user: signinData.user, session: signinData.session }, 201);
}
