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
      ref={ref}
      className="group w-full flex justify-between items-center gap-4 rounded-md text-xs p-4 bg-muted cursor-default"
    >
      <div className="flex flex-col justify-between gap-2 min-w-0">
        <h3 className="text-lg font-semibold truncate">
          Problem {problem.name}
        </h3>

        <div className="pl-1 flex items-center gap-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {problem.num_submissions}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">
                {problem.num_correct_submissions}
              </span>
            </div>
          </div>
        </div>
        {!isTiny && (
          <div className="flex items-center w-40">
            <Progress value={71} />
            <div className="flex gap-1 items-center text-xs">
              <span>71%</span>
              <div className="text-muted-foreground/70 flex items-center gap-1 w-full">
                {problem.num_correct_submissions} <p> submissions</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isSoTiny &&
        (isInContest ? (
          <Button variant="destructive" disabled>
            Selected
          </Button>
        ) : (
          <Link href={`/contests/${problem.id}`}>
            <Button variant="primary">Try Out</Button>
          </Link>
        ))}
    </div>
  );
};

export default Problem_Card;
