"use client";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { FaHourglassHalf, FaHourglassStart, FaHourglassEnd } from "react-icons/fa6";
import { getContestPhase, ContestPhase } from "@/types/types";

type Props = {
  start_date: string | Date;
  end_date: string | Date;
  mode: "practice" | "live" | null;
};

const formatting_with_zeroes = (num: number) => {
  return `${num < 10 ? "0" : ""}${Math.floor(num)}`;
};

export default function ContestHeaderTimer({ start_date, end_date, mode }: Props) {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const targetDate = useMemo(() => {
    const phase = getContestPhase({ mode, start_date, end_date });
    if (phase === "upcoming") return new Date(start_date).getTime();
    return new Date(end_date).getTime();
  }, [mode, start_date, end_date]);

  const phase = useMemo(
    () => getContestPhase({ mode, start_date, end_date }),
    [mode, start_date, end_date, now],
  );

  const diff = useMemo(() => Math.max(0, targetDate - now), [targetDate, now]);

  const days = useMemo(() => Math.floor(diff / (1000 * 60 * 60 * 24)), [diff]);
  const hours = useMemo(() => Math.floor((diff / (1000 * 60 * 60)) % 24), [diff]);
  const minutes = useMemo(() => Math.floor((diff / (1000 * 60)) % 60), [diff]);
  const seconds = useMemo(() => Math.floor((diff / 1000) % 60), [diff]);

  const timeDisplay = useMemo(() => {
    if (days > 0) {
      return `${days}d ${formatting_with_zeroes(hours)}h ${formatting_with_zeroes(minutes)}m`;
    }
    if (hours > 0) {
      return `${formatting_with_zeroes(hours)}:${formatting_with_zeroes(minutes)}:${formatting_with_zeroes(seconds)}`;
    }
    return `${formatting_with_zeroes(minutes)}:${formatting_with_zeroes(seconds)}`;
  }, [days, hours, minutes, seconds]);

  if (phase === "ended") {
    return (
      <div className="w-fit h-8 bg-card rounded-md flex items-center gap-1.5 md:gap-2 p-2 px-2 md:px-3 opacity-60">
        <FaHourglassEnd className="text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">Ended</span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 gap-1">
      <div
        className={cn(
          "w-fit h-8 bg-card rounded-md flex items-center gap-1.5 md:gap-2 p-2 px-2 md:px-3",
          phase === "upcoming" && "border border-dashed border-amber-500/40",
        )}
      >
        {phase === "upcoming" ? (
          <FaHourglassStart className="text-amber-500" />
        ) : (
          <FaHourglassHalf className="text-primary" />
        )}
        <span
          className={cn(
            "font-mono text-sm tabular-nums",
            phase === "upcoming" && "text-amber-500",
          )}
        >
          {timeDisplay}
        </span>
        {phase === "upcoming" && days === 0 && (
          <span className="hidden sm:inline text-[10px] text-muted-foreground/60">to start</span>
        )}
      </div>
    </div>
  );
}
