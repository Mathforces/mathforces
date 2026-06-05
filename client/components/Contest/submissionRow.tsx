import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import { cn, safeNumber } from "@/lib/utils";
import {
  defaultFormattedDate,
  Submission,
  SubmissionsTypes,
} from "@/types/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "../ui/button";
import { CheckCircle2, XCircle, Clock, User } from "lucide-react";

interface Props {
  type: SubmissionsTypes;
  setSubmissionType: Dispatch<SetStateAction<string>>;
}

function SubmissionsTable({ type, setSubmissionType }: Props) {
  const userProfile = useProfile((state) => state.userProfile);
  const userProfileLoading = useProfile((state) => state.loading);
  const submissionsFetch = useProblems(
    (state) => state.fetchProblemSubmissions,
  );
  const EMPTY_ARRAY: Submission[] = [];
  const problemId = useShownProblemId((state) => state.shownProblemId);
  const submissions = useProblems((state) => {
    const submissions = state.problems[problemId]?.submissions;
    return (submissions && submissions[type]) ?? EMPTY_ARRAY;
  });
  const SubmissionsLoading = useProblems(
    (state) => state.problems[problemId]?.submissions?.loading ?? true,
  );

  useEffect(() => {
    if (type && problemId) {
      submissionsFetch(problemId, type, userProfile?.id);
    }
  }, [type, problemId, userProfile?.id, submissionsFetch]);

  return (
    <>
      {submissions.length > 0 ? (
        <div className="flex flex-col gap-1 sm:gap-0">
          {/* Desktop header row */}
          <div className="hidden sm:flex gap-10 h-8 items-center px-3 text-xs text-muted-foreground font-medium">
            <div className="w-22">ID</div>
            <div className="w-20">Date & Time</div>
            <div className="w-30">User</div>
            <div className="w-20">Problem</div>
            <div className="flex-1">Answer</div>
            <div className="w-16 text-right">Score</div>
          </div>

          {submissions?.map((submission, i) => {
            const { date, time, timezone } =
              submission?.formattedDate ?? defaultFormattedDate;
            const username =
              submission.profiles?.username ??
              (submission.user_id === userProfile?.id
                ? userProfile?.username
                : undefined);
            const score = safeNumber(submission.score);
            const isSuccess = submission.status === "success";
            const isFailure = submission.status === "failure";

            return (
              <div
                key={submission.id ?? submission.display_id ?? i}
                className={cn(
                  i % 2 === 0 && "bg-bg-light",
                  "rounded-sm shadow-sm px-2 py-1.5 sm:h-12 sm:flex sm:gap-10 sm:items-center sm:px-3 sm:py-2",
                  isSuccess &&
                    "border-l-[3px] border-l-success sm:border-l-0 sm:border-l-transparent",
                  isFailure &&
                    "border-l-[3px] border-l-destructive sm:border-l-0 sm:border-l-transparent",
                )}
              >
                {/* Mobile compact layout */}
                <div className="flex flex-col sm:hidden min-w-0">
                  {/* Line 1: status + username + answer + score */}
                  <div className="flex items-center gap-1 min-w-0">
                    {isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-success" />
                    ) : isFailure ? (
                      <XCircle className="w-3.5 h-3.5 shrink-0 text-destructive" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium truncate min-w-0 text-foreground">
                      {username?.charAt(0)}
                      <span className="text-orange-500">
                        {username?.slice(1)}
                      </span>
                    </span>
                    {submission.user_answer && (
                      <span className="text-[11px] text-muted-foreground/60 shrink-0">·</span>
                    )}
                    <span
                      className={cn(
                        "text-[11px] font-mono truncate min-w-0",
                        isSuccess && "text-success",
                        isFailure && "text-destructive",
                      )}
                    >
                      {submission.user_answer ?? ""}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold shrink-0 ml-auto",
                        isSuccess && "text-success",
                        isFailure && "text-destructive",
                      )}
                    >
                      {score > 0 ? `+${score}` : score}
                    </span>
                  </div>
                  {/* Line 2: problem + date (subtle) */}
                  <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                    <span className="text-[10px] text-muted-foreground/50 truncate">
                      {submission.problems?.name ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 shrink-0">
                      {date} {time}
                    </span>
                  </div>
                </div>

                {/* Desktop row layout */}
                <div className="hidden sm:flex sm:items-center sm:gap-10 sm:w-full">
                  {/* Submission Id */}
                  <div className="border border-muted-foreground/20 px-2 text-center rounded-md w-22">
                    <span className="underline text-primary text-sm">
                      {submission.display_id}
                    </span>
                  </div>

                  {/* Submission Date */}
                  <div className="flex items-center flex-col text-xs text-text/60 w-20 truncate">
                    <span>{date}</span>
                    <span className="flex gap-[2px]">
                      {time}
                      <span className="text-[8px]">{timezone}</span>
                    </span>
                  </div>

                  {/* Username */}
                  <span className="text-text/60 w-30 truncate">
                    {username?.charAt(0)}
                    <span className="text-orange-500">
                      {username?.slice(1)}
                    </span>
                  </span>

                  {/* Problem title */}
                  <span className="text-text/60 w-20 truncate">
                    {submission.problems?.name}
                  </span>

                  {/* Answer */}
                  <span
                    className={cn(
                      "flex-1 truncate font-medium",
                      isSuccess && "text-success",
                      isFailure && "text-destructive",
                    )}
                  >
                    Ans: {submission.user_answer}
                  </span>

                  {/* Score */}
                  <span
                    className={cn(
                      "w-16 text-right font-semibold",
                      isSuccess && "text-success",
                      isFailure && "text-destructive",
                    )}
                  >
                    {score > 0 ? `+${score}` : score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full my-5 px-4">
          {!userProfileLoading &&
          !userProfile &&
          (type === "your_submissions" || type === "friends_submissions") ? (
            <div className="flex items-center text-center flex-col gap-3 max-w-sm">
              <div className="space-y-2">
                <h4 className="text-base">You&apos;re not Signed in</h4>
                <p className="text-sm text-muted-foreground">
                  Please login or sign up to view your own submissions{" "}
                  <button
                    className="underline text-primary cursor-pointer"
                    onClick={() => setSubmissionType("general_submissions")}
                  >
                    or go to general submissions
                  </button>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={"primary"}
                  link="/sign_up"
                  className="text-xs py-0"
                >
                  Sign Up
                </Button>
                <Button
                  variant={"outline"}
                  link="/sign_in"
                  className="text-xs py-2"
                >
                  Sign in
                </Button>
              </div>
            </div>
          ) : SubmissionsLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-5 h-5 animate-pulse text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading submissions...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                There are no submissions for this problem yet!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SubmissionsTable;
