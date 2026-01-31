import { ProblemCore, ProblemStatus, Submission } from "@/types/types";
import { create } from "zustand";

interface Problem {
  core: ProblemCore;
  submissions: Submission[];
}
interface ContestProblemsContext {
  problems: Record<string, Problem>;
  fetch_core: (problemId: string) => Promise<void>;
}

interface ShownProblemIdContext {
  shownProblemId: string;
  setShownProblemId: (problemId: string) => void;
}
export const useShownProblemId = create<ShownProblemIdContext>((set, get) => ({
  shownProblemId: "",
  setShownProblemId: (problemId: string) => set({ shownProblemId: problemId }),
}));

export const useContestProblems = create<ContestProblemsContext>(
  (set, get) => ({
    problems: {},
    // Fetch core of problem data [problem statement, problem Name, Problem Answer]
    fetch_core: async (problemId: string) => {
      // Check if it exists first
      const existingProblem = get().problems[problemId];
      if (existingProblem) {
        return;
      }

      // Check if the local storage has the data first
      const cached = localStorage.getItem(`problem_${problemId}_core`);
      if (cached) {
        set((state) => ({
          problems: {
            ...state.problems,
            [problemId]: {
              ...state.problems[problemId],
              core: JSON.parse(cached),
            },
          },
        }));
        return;
      }

      // Get core data from DB
      else {
        try {
          const response = await fetch(`/api/problems/${problemId}/core`);
          if (response) {
            const coreData = await response.json();
            set((state) => ({
              problems: {
                ...state.problems,
                [problemId]: {
                  ...state.problems[problemId],
                  core: coreData,
                },
              },
            }));
            // Cache the data in local storage
            localStorage.setItem(
              `problem_${problemId}_core`,
              JSON.stringify(coreData),
            );
          }
          else{
            console.error("Error while fetching problem core: ", response)
          }
        } catch (error) {
          console.error("Failed to fetch problem core data:", error);
        }
      }
    },
  }),
);
