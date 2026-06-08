"use client";

import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { ContestProblem } from "@/types/types";
import { cn, safeNumber, safePercent } from "@/lib/utils";
import { useShownProblemId } from "@/app/store";

interface Props {
  problem: ContestProblem;
  problemsStatus: Record<string, string>;
  onProblemSelect?: () => void;
}

const Problem_Card = ({ problem, problemsStatus, onProblemSelect }: Props) => {
  const { shownProblemId, setShownProblemId } = useShownProblemId();
  const submissionCount = safeNumber(problem.submission_count);
  const correctSubmissionCount = safeNumber(problem.correct_submission_count);
  const solvedPercentage = safePercent(correctSubmissionCount, submissionCount);
  const handleProblemSelect = () => {
    setShownProblemId(problem.id);
    onProblemSelect?.();
  };

  return (
    <div
      key={`${problem.name}-${problem.id}`}
      onClick={handleProblemSelect}
      className={cn(
        `group w-full flex flex-col gap-3 rounded-md bg-muted p-3 text-xs cursor-pointer sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4`,
        ` ${shownProblemId == problem.id && "outline outline-border-muted/40 shadow-xs shadow-border"}`,
        ` ${problemsStatus[problem.id] === "success" ? "border border-success/30" : problemsStatus[problem.id] === "failure" ? "border border-destructive/30" : ""}`,
      )}
    >
      {/* Left section of problem */}
      <div className="min-w-0 flex flex-1 flex-col justify-between gap-2">
        {/* Problem.name */}
        <h3
          className={`break-words text-base sm:text-lg ${shownProblemId == problem.id ? "font-semibold text-text" : "text-muted-foreground"}`}
        >
          Problem {problem.name}
        </h3>

        {/* Lower-left part (Problem details) */}
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 sm:pl-1">
          {/* likess & commentss */}
          <div className="flex items-center gap-3">
            {/* likes */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <ThumbsUp className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">
                {safeNumber(problem.likes_count)}
              </span>
            </div>

            {/* comments */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />{" "}
              <span className="text-sm font-medium">
                {safeNumber(problem.comments_count)}
              </span>
            </div>
          </div>

          {/* People answered */}
          <div className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:flex-row sm:items-center">
            <Progress
              value={solvedPercentage}
              className="h-[3px] w-full bg-background *:bg-success/50 sm:w-24"
            />
            <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-xs">
              <span>{solvedPercentage}%</span>
              <span className="text-muted-foreground/70">
                ({correctSubmissionCount} / {submissionCount} submissions)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      {problemsStatus[problem.id] === "success" ? (
        <Button
          variant={"secondary"}
          className="h-9 w-full bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60 sm:w-auto"
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
          className="h-9 w-full bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60 sm:w-auto"
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
          className="h-9 w-full bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60 sm:w-auto"
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
