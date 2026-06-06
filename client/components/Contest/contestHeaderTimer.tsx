"use client";

import { useMemo, useRef, useState } from "react";
import Countdown, { CountdownApi } from "react-countdown";
import { FaHourglassHalf, FaStop } from "react-icons/fa6";
import { VscDebugStart } from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { getContestMode, getContestPhase } from "@/lib/contest";
import { Contest } from "@/types/types";

type Props = {
  contest: Contest;
};

type TimerStatus = "Start" | "Pause" | "Resume";

const formatWithZeroes = (num: number) => `${num < 10 ? "0" : ""}${Math.floor(num)}`;

function LiveTimer({ contest }: { contest: Contest }) {
  const phase = contest.contest_phase ?? getContestPhase(contest);
  const targetDate =
    phase === "upcoming"
      ? new Date(contest.start_date).getTime()
      : new Date(contest.end_date).getTime();
  const label = phase === "upcoming" ? "Starts" : phase === "ended" ? "Ended" : "Ends";

  return (
    <div className="flex min-w-0 gap-1">
      <div className="w-fit h-8 bg-card rounded-md flex items-center gap-1.5 md:gap-2 p-2 px-2 md:px-3">
        <FaHourglassHalf className="text-primary" />
        <span className="hidden sm:inline text-xs text-muted-foreground">
          {label}
        </span>
        {phase === "ended" ? (
          <span className="font-mono text-sm">00:00</span>
        ) : (
          <Countdown
            date={targetDate}
            renderer={({ hours, minutes, seconds, completed, days }) => {
              if (completed) return <span className="font-mono text-sm">00:00</span>;

              const totalHours = hours + days * 24;
              const hrs = formatWithZeroes(totalHours);
              const mins = formatWithZeroes(minutes);
              const secs = formatWithZeroes(seconds);

              return (
                <span className="font-mono text-sm">
                  {totalHours > 0 ? `${hrs}:${mins}` : `${mins}:${secs}`}
                </span>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

function PracticeTimer({ contest }: { contest: Contest }) {
  const countdownApiRef = useRef<CountdownApi | null>(null);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("Start");
  const [startTime, setStartTime] = useState<number | null>(null);

  const targetDate = useMemo(() => {
    if (startTime === null) {
      return new Date().getTime() + 1000 * 60 * contest.length_in_minutes;
    }

    return startTime + 1000 * 60 * contest.length_in_minutes;
  }, [contest.length_in_minutes, startTime]);

  const setRef = (countdown: Countdown | null) => {
    countdownApiRef.current = countdown?.getApi() ?? null;
  };

  const toggleTimerStatus = () => {
    if (!countdownApiRef.current) return;

    if (timerStatus === "Start") {
      setStartTime(Date.now());
      countdownApiRef.current.start();
      setTimerStatus("Pause");
    } else if (timerStatus === "Pause") {
      setTimerStatus("Resume");
      countdownApiRef.current.pause();
    } else {
      countdownApiRef.current.start();
      setTimerStatus("Pause");
    }
  };

  const stopTimer = () => {
    if (!countdownApiRef.current) return;

    countdownApiRef.current.stop();
    setTimerStatus("Start");
  };

  const CountdownRenderer = ({
    hours,
    minutes,
    seconds,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    const hrs = formatWithZeroes(hours);
    const mins = formatWithZeroes(minutes);
    const secs = formatWithZeroes(seconds);

    if (hours > 0) {
      return `${hrs}:${mins}`;
    }

    return `${mins}:${secs}`;
  };

  return (
    <div className="flex min-w-0 gap-1">
      <div className="w-fit h-8 bg-card rounded-l-md flex items-center gap-1.5 md:gap-2 p-2 px-2 md:px-3">
        <FaHourglassHalf className="text-primary" />
        <Countdown
          date={targetDate}
          ref={setRef}
          renderer={CountdownRenderer}
          autoStart={false}
        />
      </div>

      <div className="w-fit h-8 bg-card rounded-r-md flex items-center p-2 gap-2 md:gap-4">
        <button
          className={cn(
            "flex items-center justify-center gap-2 cursor-pointer opacity-70 hover:opacity-90",
            timerStatus === "Pause" ? "*:!text-destructive" : "*:!text-success",
          )}
          onClick={() => toggleTimerStatus()}
        >
          <VscDebugStart />
          <p className="hidden sm:block text-base font-mono">{timerStatus}</p>
        </button>
        {timerStatus !== "Start" && (
          <button onClick={() => stopTimer()} className="cursor-pointer p-0">
            <FaStop className="text-destructive text-sm" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ContestHeaderTimer({ contest }: Props) {
  const mode = getContestMode(contest);

  if (mode === "live") {
    return <LiveTimer contest={contest} />;
  }

  return <PracticeTimer contest={contest} />;
}
