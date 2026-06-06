"use client";
import { safeNumber } from "@/lib/utils";
import { getRankingColor } from "@/lib/ranking";
import { calculateOpacity } from "@/lib/score";
import { useVirtualList } from "@/hook/useVirtualList";
import { ContestProblem, Standing } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ROW_HEIGHT = 44;
const NARROW_THRESHOLD = 300;

type Props = {
  contestId: string;
  problems: ContestProblem[];
};

const ContestStandings = ({ contestId, problems }: Props) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => setIsNarrow(el.clientWidth < NARROW_THRESHOLD);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getStandings = async () => {
    setStandingsLoading(true);
    axios
      .get(`/api/contests/${contestId}/standings`)
      .then((res) => {
        if (res) {
          setStandings(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setStandingsLoading(false);
      });
  };

  useEffect(() => {
    getStandings();
  }, []);

  const {
    containerRef,
    totalHeight,
    startIndex,
    visibleItems,
    offsetY,
  } = useVirtualList(standings, { itemHeight: ROW_HEIGHT });

  if (standingsLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ height: ROW_HEIGHT }}>
            <Skeleton className="h-5 w-6 shrink-0" />
            <Skeleton className="h-5 w-24 shrink-0" />
            <div className="flex gap-1 flex-1">
              {problems.map((_, j) => (
                <Skeleton key={j} className="h-5 w-5 shrink-0" />
              ))}
            </div>
            <Skeleton className="h-5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No standings yet.
      </div>
    );
  }

  return (
    <div ref={outerRef} className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-muted-foreground bg-card border-b border-border/50 shrink-0">
        <span className="w-5 shrink-0 text-center">#</span>
        <span className="w-28 shrink-0">Username</span>
        {!isNarrow && (
          <div className="flex gap-1 overflow-hidden shrink min-w-0">
            {problems.map((p) => {
              const letter = p.index_in_contest != null
                ? String.fromCharCode(65 + p.index_in_contest)
                : "?";
              const label = p.name && p.name.length <= 4 ? p.name : letter;
              return (
                <span
                  key={p.id}
                  className="w-5 shrink-0 text-center truncate"
                  title={p.name || letter}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
        <span className="w-12 shrink-0 text-right">Score</span>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto flex-1 min-h-0"
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleItems.map((standing, i) => {
              const globalIndex = startIndex + i;
              const rank = globalIndex + 1;
              const username = standing?.profiles?.username ?? "UNKNOWN";
              const color = getRankingColor(standing.elo_rating ?? 0);

              return (
                <div
                  key={standing.id ?? globalIndex}
                  className="flex items-center gap-2 px-2 hover:bg-muted/40 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span className="w-5 shrink-0 text-xs text-muted-foreground text-center">
                    {rank}
                  </span>

                  <Link
                    href={`/profile/${username}`}
                    className={`w-28 shrink-0 text-sm font-medium truncate ${color} hover:underline`}
                  >
                    {username}
                  </Link>

                  {!isNarrow && (
                    <div className="flex gap-1 overflow-hidden shrink min-w-0">
                      {problems.map((problem) => {
                        const myScore =
                          standing.problem_scores?.[problem.id] ?? 0;
                        const baseScore = problem.points ?? 0;

                        const opacity = calculateOpacity(myScore, baseScore) / 100;
                        return (
                          <div
                            key={problem.id}
                            className="w-5 h-5 shrink-0 rounded-sm bg-primary"
                            style={{ opacity: Math.max(0.35, opacity) }}
                            title={`${problem.name}: ${myScore}/${baseScore}`}
                          />
                        );
                      })}
                    </div>
                  )}

                  <span className="w-12 shrink-0 text-sm font-semibold text-right tabular-nums">
                    {safeNumber(standing.score)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestStandings;
