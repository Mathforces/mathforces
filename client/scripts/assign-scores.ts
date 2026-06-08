import { createClient } from "@supabase/supabase-js";

const CONTEST_ID = "05c5624d-7054-497f-8bb2-a46ef2e5be08";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("id, index_in_contest, name, points")
    .eq("contest_id", CONTEST_ID)
    .order("index_in_contest", { ascending: true });

  if (error) {
    console.error("Error fetching problems:", error);
    return;
  }

  console.log(`Found ${problems.length} problems for NMC 54`);

  for (const problem of problems) {
    const idx = problem.index_in_contest ?? 0;
    const baseScore = 98 + (idx + 1) * 4.5;
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
        `${letter} (${problem.name}) ${problem.points} -> ${points}`,
      );
    }
  }

  console.log("Done!");
}

main();
