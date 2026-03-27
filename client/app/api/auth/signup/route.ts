import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, apiError, requireFields } from "@/lib/api/response";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const missingFields = requireFields(body, ["username", "email", "password"]);
  if (missingFields) return missingFields;

  const supabaseClient = createSupabaseServerClient();

  const { data: authData, error: authError } = await (await supabaseClient).auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (authError) return apiError(authError.message, 400);
  if (!authData.user) return apiError("Failed to create user", 500);

  axios.post('/api/auth/signup/create_profile', { id: authData.user.id, username: body.username, email: body.email })
    .then((res) => {
      if (!res || !res.data.success) {
        console.error("Failed to create profile");
      }
    });

  return json({ success: true, user: authData.user }, 201);
}
