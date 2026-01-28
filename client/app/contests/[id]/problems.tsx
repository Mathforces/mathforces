import Problem_Card from "@/components/Contest/Problem_Card";
import { TabsContent } from "@/components/ui/tabs";
import { Contest, contestProblem } from "@/types/types";
import Image from "next/image";
import * as React from "react";
import { BsTag } from "react-icons/bs";

interface ContestProblemsProps {
  contest: Contest;
  problems: contestProblem[];
  shownProblem: string | null;
  setShownProblem: React.Dispatch<React.SetStateAction<string | null>>;
  problemsStatus: Record<string, string>;
}

const ContestProblems: React.FunctionComponent<ContestProblemsProps> = ({
  contest,
  problems,
  shownProblem,
  setShownProblem,
  problemsStatus,
}) => {
  return (
    <div>
      <TabsContent value="problems" className="p-4 flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">{contest.name}</h2>
          <div className="flex gap-1">
            <div className="bg-muted px-3 py-1 rounded-lg flex items-center justify-center">
              {/* TODO: Customize this to have multiple colors according to the difficulty */}
              <span className="text-destructive">
                {contest.difficulty ?? "Unset"}
              </span>
            </div>
            <div className="bg-muted px-2 py-1 rounded-lg flex items-center gap-1 justify-center">
              <BsTag />
              <span>Topics</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full py-2 pr-2">
          {problems.map((problem) => (
            <div onClick={() => setShownProblem(problem.id)} className="w-full">
              <Problem_Card
                key={problem.id}
                problem={problem}
                setShownProblem={setShownProblem}
                shownProblem={shownProblem}
                problemsStatus={problemsStatus}
              />
            </div>
          ))}
        </div>

        {/* Copyrights */}
        <section className="flex flex-col justify-center items-center gap-2">
          <div className="flex items-center text-xs">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="h-3 w-10 object-contain"
            />
            2026
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Terms of use
            </button>
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Cookie notice
            </button>
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Privacy policy
            </button>
          </div>
        </section>
      </TabsContent>
    </div>
  );
};

export default ContestProblems;
