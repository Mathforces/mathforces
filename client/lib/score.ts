const RATIO_DECREASE = 1;

export function calculateScore(
  baseScore: number,
  contestStartDate: string | Date,
  currentTime?: Date,
): number {
  const start = new Date(contestStartDate);
  const now = currentTime ?? new Date();
  const minutesSinceStart = (now.getTime() - start.getTime()) / 60000;
  const deduction = minutesSinceStart * RATIO_DECREASE;
  return Math.max(0, Math.round(baseScore - deduction));
}

export function calculateOpacity(myScore: number, baseScore: number): number {
  if (baseScore <= 0 || myScore <= 0) return 0;
  const percentage = (myScore / baseScore) * 100;
  return Math.max(35, Math.min(100, Math.round(percentage)));
}
