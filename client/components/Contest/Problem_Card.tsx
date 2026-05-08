"use client";

import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { ContestProblem } from "@/types/types";
import { cn } from "@/lib/utils";
import { useShownProblemId } from "@/app/store";

interface Props {
  problem: ContestProblem;
  problemsStatus: Record<string, string>;
  onProblemSelect?: () => void;
}

const Problem_Card = ({ problem, problemsStatus, onProblemSelect }: Props) => {
  const { shownProblemId, setShownProblemId } = useShownProblemId();
  const handleProblemSelect = () => {
    setShownProblemId(problem.id);
    onProblemSelect?.();
  };

  return (
    <div
      key={`${problem.name}-${problem.id}`}
      onClick={handleProblemSelect}
      className={cn(
        ` group w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-md text-xs p-4 bg-muted cursor-pointer`,
        ` ${shownProblemId == problem.id && "outline outline-border-muted/40 shadow-xs shadow-border"}`,
        ` ${problemsStatus[problem.id] === "success" ? "border border-success/30" : problemsStatus[problem.id] === "failure" ? "border border-destructive/30" : ""}`,
      )}
    >
      {/* Left section of problem */}
      <div className="flex flex-col justify-between gap-2 ">
        {/* Problem.name */}
        <h3
          className={`text-lg ${shownProblemId == problem.id ? "font-semibold text-text" : "text-muted-foreground"}`}
        >
          Problem {problem.name}
        </h3>

        {/* Lower-left part (Problem details) */}
        <div className="pl-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* likess & commentss */}
          <div className="flex justify-between items-center gap-2">
            {/* likes */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <ThumbsUp className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">
                {problem.likes_count ?? 0}
              </span>
            </div>

            {/* comments */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">
                {problem.comments_count ?? 0}
              </span>
            </div>
          </div>

          {/* People answered */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <Progress
              value={
                ((problem.correct_submission_count ?? 0) /
                  (problem.submission_count ?? 1)) *
                100
              }
              className="bg-background w-24 h-[3px] *:bg-success/50"
            />
            <div className="flex gap-1 items-center text-xs">
              <span>
                {Math.round(
                  ((problem.correct_submission_count ?? 0) /
                    (problem.submission_count ?? 1)) *
                    100,
                )}
                %
              </span>
              <span className="text-muted-foreground/70">
                ({problem.correct_submission_count ?? 0} /{" "}
                {problem.submission_count ?? 0} submissions)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      {problemsStatus[problem.id] === "success" ? (
        <Button
          variant={"secondary"}
          className="w-full sm:w-auto bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60"
          onClick={(event) => {
            event.stopPropagation();
            handleProblemSelect();
          }}
        >
          Review
        </Button>
      ) : problemsStatus[problem.id] === "failure" ? (
        <Button
          variant={"secondary"}
          className="w-full sm:w-auto bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60"
          onClick={(event) => {
            event.stopPropagation();
            handleProblemSelect();
          }}
        >
          Try again
        </Button>
      ) : (
        <Button
          variant={"secondary"}
          className="w-full sm:w-auto bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60"
          onClick={(event) => {
            event.stopPropagation();
            handleProblemSelect();
          }}
        >
          Try out
        </Button>
      )}
    </div>
  );
};

export default Problem_Card;
