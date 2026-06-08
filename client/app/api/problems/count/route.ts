import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, handleSupabaseError } from "@/lib/api/response";

let countCache = { value: 0, lastFetch: 0 };
const CACHE_TTL_MS = 24 * (60 * 60 * 1000); // every 24hrs

export async function GET(request: Request) {
  const now = Date.now();
  if (now - countCache.lastFetch < CACHE_TTL_MS) {
    return json(countCache.value);
  }

  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("problems")
    .select("*", { count: "planned", head: true });

  const err = handleSupabaseError(error, "problem discussions");
  if (err) return err;

  if (count) {
    countCache = { value: count, lastFetch: now };
  }

  return json(count);
}
