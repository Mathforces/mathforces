"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Problem } from "@/types/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  problem: Problem;
}

const Problem_Card = ({ problem }: Props) => {
  const pathName = usePathname();
  const isInContest = pathName.includes(`/contests/${problem.id}`);

  const ref = useRef<HTMLDivElement | null>(null);
  const [isTiny, setIsTiny] = useState(false);
  const [isSoTiny, setIsSoTiny] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const RO = (window as any).ResizeObserver;
    if (!RO) return;

    let raf = 0;
    const observer = new RO((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = Math.round(entry.contentRect.width);
        setIsTiny(w < 380);
        setIsSoTiny(w < 300);
      });
    });

    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      key={`${problem.name}-${problem.id}`}
      onClick={() => {}}
      className=" group w-full flex justify-between items-center gap-4 rounded-md text-xs p-4 bg-muted cursor-default  "
    >
      {/* Left section of problem */}
      <div className="flex flex-col justify-between gap-2 ">
        {/* Problem.name */}
        <h3 className="text-lg font-semibold">Problem {problem.name}</h3>

        {/* Lower part */}
        <div className="pl-1 flex items-center gap-3">
          {/* likess & commentss */}
          <div className="flex justify-between items-center gap-2">
            {/* likes */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <ThumbsUp className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">{problem.likes ?? 0}</span>
            </div>

            {/* comments */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">{problem.comments_num ?? 0}</span>
            </div>
          </div>

          {/* People answered */}
          <div className="flex items-center">
            {/* TODO: change to people answered */}
            <Progress
              value={71}
              className="bg-background w-24 h-[3px] *:bg-success/50"
            />
            <div className="flex gap-1 items-center text-xs">
              <span>71%</span>
              <span className="text-muted-foreground/70">
                (1200 submissions)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button
        variant={"secondary"}
        className="bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60"
      >
        Try Out
      </Button>
    </div>
  );
};

export default Problem_Card;
