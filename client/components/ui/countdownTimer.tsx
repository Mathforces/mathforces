"use client";

import { useRef } from "react";
import Countdown, { CountdownApi } from "react-countdown";

type CountdownTimerProps = {
  /** Target date (Date object or timestamp in ms) */
  date: Date | number;
  /** Label prefix (e.g. "Ends", "Starts") */
  label?: string;
  /** Called when countdown completes */
  onComplete?: () => void;
  /** Whether to auto-start (default true) */
  autoStart?: boolean;
  /** Expose CountdownApi ref */
  countdownApiRef?: React.MutableRefObject<CountdownApi | null>;
  /** Additional className on the outer span */
  className?: string;
};

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/**
 * Formats remaining time with letter suffixes.
 *
 * ≥ 1 day  → "Xd:Xh:Xm"
 * ≥ 60 min → "Xh:Xm"
 * < 60 min → "Xm:Xs"
 */
export function formatCountdown({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const totalHours = hours + days * 24;

  if (days > 0) {
    return `${days}d:${pad(totalHours % 24)}h:${pad(minutes)}m`;
  }
  if (totalHours > 0) {
    return `${pad(totalHours)}h:${pad(minutes)}m`;
  }
  return `${pad(minutes)}m:${pad(seconds)}s`;
}

export default function CountdownTimer({
  date,
  label,
  onComplete,
  autoStart = true,
  countdownApiRef,
  className,
}: CountdownTimerProps) {
  const internalApiRef = useRef<CountdownApi | null>(null);
  const apiRef = countdownApiRef ?? internalApiRef;

  const setRef = (countdown: Countdown | null) => {
    apiRef.current = countdown?.getApi() ?? null;
  };

  return (
    <span className={className}>
      {label && (
        <span className="text-xs text-muted-foreground mr-1.5">{label}</span>
      )}
      <Countdown
        date={date}
        ref={setRef}
        autoStart={autoStart}
        onComplete={onComplete}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          if (completed) {
            return <span className="font-mono text-sm">00m:00s</span>;
          }

          const text = formatCountdown({ days, hours, minutes, seconds });
          return <span className="font-mono text-sm">{text}</span>;
        }}
      />
    </span>
  );
}
