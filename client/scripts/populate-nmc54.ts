import { createClient } from "@supabase/supabase-js";

const CONTEST_ID = "05c5624d-7054-497f-8bb2-a46ef2e5be08";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function calculateScore(
  baseScore: number,
  contestStartDate: string,
  submissionTime: Date,
): number {
  const start = new Date(contestStartDate);
  const minutesSinceStart =
    (submissionTime.getTime() - start.getTime()) / 60000;
  const deduction = minutesSinceStart * 1;
  return Math.max(0, Math.round(baseScore - deduction));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function main() {
  const { data: contest } = await supabase
    .from("contests")
    .select("start_date")
    .eq("id", CONTEST_ID)
    .single();

  if (!contest) {
    console.error("Contest not found");
    return;
  }

  const contestStart = contest.start_date;
  console.log("Contest start:", contestStart);

  const { data: problems, error: probError } = await supabase
    .from("problems")
    .select("id, name, index_in_contest, points")
    .eq("contest_id", CONTEST_ID)
    .order("index_in_contest");

  if (probError || !problems) {
    console.error("Error fetching problems:", probError);
    return;
  }

  console.log(`Problems: ${problems.length}`);

  const { data: registrations, error: regError } = await supabase
    .from("registered_in_contest")
    .select("user_id")
    .eq("contest_id", CONTEST_ID);

  if (regError || !registrations) {
    console.error("Error fetching registrations:", regError);
    return;
  }

  const userIds = registrations.map((r) => r.user_id).filter(Boolean) as string[];
  console.log(`Users: ${userIds.length}`);

  for (const userId of userIds) {
    const numProblems = randomBetween(1, problems.length);
    const chosenProblems = randomSubset(problems, numProblems);
    let totalScore = 0;
    let submissionCount = 0;

    console.log(
      `\nUser ${userId}: submitting ${numProblems} problems`,
    );

    for (const problem of chosenProblems) {
      const offsetMinutes = randomBetween(0, 75);
      const submissionTime = new Date(
        new Date(contestStart).getTime() + offsetMinutes * 60000,
      );
      const baseScore = problem.points ?? 100;
      const score = calculateScore(baseScore, contestStart, submissionTime);

      const { error: subError } = await supabase.from("submissions").insert({
        problem_id: problem.id,
        user_id: userId,
        score,
        status: "success",
        user_answer: Math.random() > 0.5 ? "42" : "7",
        created_at: submissionTime.toISOString(),
      });

      if (subError) {
        console.error(
          `  Error submitting ${problem.name}:`,
          subError.message,
        );
      } else {
        totalScore += score;
        submissionCount++;
        console.log(
          `  ${problem.name}: score=${score} time=+${offsetMinutes}min`,
        );
      }
    }

    const penalty = randomBetween(0, 3) * 10;

    const { data: existing } = await supabase
      .from("standings")
      .select("id")
      .eq("contest_id", CONTEST_ID)
      .eq("user_id", userId)
      .maybeSingle();

    let standingError;
    if (existing) {
      ({ error: standingError } = await supabase
        .from("standings")
        .update({ score: totalScore, penalty })
        .eq("id", existing.id));
    } else {
      ({ error: standingError } = await supabase
        .from("standings")
        .insert({ contest_id: CONTEST_ID, user_id: userId, score: totalScore, penalty }));
    }

    if (standingError) {
      console.error(`  Error upserting standing:`, standingError.message);
    } else {
      console.log(
        `  Total: ${totalScore} score, ${penalty} penalty (${submissionCount} submissions)`,
      );
    }
  }

  console.log("\nDone populating NMC 54!");
}

main();
