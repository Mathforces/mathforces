import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError, requireFields } from "@/lib/api/response";

export async function POST(request: Request) {
  const body = await request.json();
  const missingFields = requireFields(body, ["username", "email", "password"]);
  if (missingFields) return missingFields;

  const email = String(body.email).trim().toLowerCase();
  const username = String(body.username).trim();
  const supabaseService = createSupabaseServiceClient();

  const { data: existingEmailProfile, error: existingEmailProfileError } =
    await supabaseService
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

  if (existingEmailProfileError) {
    return apiError(existingEmailProfileError.message, 500);
  }
  if (existingEmailProfile) {
    return apiError("Email is already registered", 409);
  }

  const { data: existingUsernameProfile, error: existingUsernameProfileError } =
    await supabaseService
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

  if (existingUsernameProfileError) {
    return apiError(existingUsernameProfileError.message, 500);
  }
  if (existingUsernameProfile) {
    return apiError("Username is already taken", 409);
  }

  const perPage = 1000;
  for (let page = 1; ; page += 1) {
    const { data: usersData, error: usersError } =
      await supabaseService.auth.admin.listUsers({
        page,
        perPage,
      });

    if (usersError) return apiError(usersError.message, 500);
    if (
      usersData.users.some((user) => user.email?.trim().toLowerCase() === email)
    ) {
      return apiError("Email is already registered", 409);
    }
    if (usersData.users.length < perPage) break;
  }

  const supabaseClient = createSupabaseServerClient();

  const { data: authData, error: authError } = await (
    await supabaseClient
  ).auth.signUp({
    email,
    password: body.password,
  });

  if (authError) return apiError(authError.message, 400);
  if (!authData.user) return apiError("Failed to create user", 500);

  if (authData.user.identities?.length === 0) {
    return apiError("Email is already registered", 409);
  }

  const { error: profileError } = await supabaseService
    .from("profiles")
    .insert([{ id: authData.user.id, username, email }]);

  if (profileError) {
    await supabaseService.auth.admin.deleteUser(authData.user.id);
    return apiError(profileError.message, 500);
  }

  return json({ success: true, user: authData.user }, 201);
}
