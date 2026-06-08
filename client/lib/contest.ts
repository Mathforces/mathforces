export type ContestMode = "practice" | "live";
export type ContestPhase = "practice" | "upcoming" | "live" | "ended";

export type ContestTiming = {
  mode?: string | null;
  start_date?: string | Date | null;
  end_date?: string | Date | null;
};

export function getContestMode(contest: ContestTiming | null | undefined) {
  return contest?.mode === "live" ? "live" : "practice";
}

export function getContestPhase(
  contest: ContestTiming | null | undefined,
  now: Date = new Date(),
): ContestPhase {
  if (getContestMode(contest) !== "live") return "practice";

  const start = contest?.start_date ? new Date(contest.start_date) : null;
  const end = contest?.end_date ? new Date(contest.end_date) : null;

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "ended";
  }

  if (now < start) return "upcoming";
  if (now >= end) return "ended";
  return "live";
}

export function isLiveContestOpen(
  contest: ContestTiming | null | undefined,
  now: Date = new Date(),
) {
  return getContestPhase(contest, now) === "live";
}
