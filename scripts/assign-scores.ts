import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../client/.env") });
dotenv.config({ path: path.resolve(__dirname, "../client/.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("id, index_in_contest, name")
    .order("index_in_contest", { ascending: true });

  if (error) {
    console.error("Error fetching problems:", error);
    return;
  }

  console.log(`Found ${problems.length} problems`);

  for (const problem of problems) {
    const idx = problem.index_in_contest ?? 0;
    const baseScore = 98 + (idx + 1) * 3;
    const randomOffset = Math.floor(Math.random() * 5) - 2;
    const points = Math.max(0, Math.round(baseScore + randomOffset));

    const { error: updateError } = await supabase
      .from("problems")
      .update({ points })
      .eq("id", problem.id);

    if (updateError) {
      console.error(`Error updating problem ${problem.id}:`, updateError);
    } else {
      const letter = String.fromCharCode(65 + idx);
      console.log(
        `${letter} (index ${idx}, name: ${problem.name}) -> ${points} points`,
      );
    }
  }

  console.log("Done assigning scores!");
}

main();
