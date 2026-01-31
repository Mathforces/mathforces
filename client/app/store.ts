import {
  ProblemCore,
  ProblemStatus,
  Submission,
  UserProfile,
} from "@/types/types";
import axios from "axios";
import { create } from "zustand";

export const useProfile = create<UserProfile>(() => ({
  id: "",
  created_at: new Date(),
  updated_at: new Date(),
  email: "",
  first_name: "",
  last_name: "",
  username: "",
  image: "",
  bio: "",
}));

interface Problem {
  core: ProblemCore;
  coreLoading: boolean;
  submissions: Submission[];
}
interface ContestProblemsContext {
  problems: Record<string, Problem>;

  fetchCore: (problemId: string) => Promise<void>;

  fetchProblemSubmissions: (userId: string, problemId: string) => Promise<void>;
}

export const useProblems = create<ContestProblemsContext>((set, get) => ({
  problems: {},
  coreLoading: false,
  // Fetch core of problem data [problem statement, problem Name, Problem Answer]
  fetchCore: async (problemId: string) => {
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
      set((state) => ({
        problems: {
          ...state.problems,
          [problemId]: {
            ...state.problems[problemId],
            coreLoading: true,
          },
        },
      }));

      try {
        const response = await axios(`/api/problems/${problemId}/core`);
        if (response) {
          const coreData = response.data;
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
        } else {
          console.error("Error while fetching problem core: ", response);
        }
      } catch (error) {
        console.error("Failed to fetch problem core data:", error);
      }

      set((state) => ({
        problems: {
          ...state.problems,
          [problemId]: {
            ...state.problems[problemId],
            coreLoading: false,
          },
        },
      }));
    }
  },

  // Fetch user submitted Submissions of a problem
  fetchProblemSubmissions: async (userId: string, problemId: string) => {
    try {
      // check if it's saved
      const problem = get().problems[problemId];
      // if (problem?.submissions || problem?.coreLoading) {
      //   return;
      // }
      console.log("core loading: ", problem?.coreLoading)
      // Check if core is still loading (in order not to interfere with the network request and give it privilege)
      if (problem?.coreLoading == true) {
        const unsubscribe = useProblems.subscribe((state, prevState) => {
          const wasLoading = prevState.problems[problemId]?.coreLoading;
          const isLoading = state.problems[problemId]?.coreLoading;
          if (!isLoading && wasLoading) {
            unsubscribe();
            get().fetchProblemSubmissions(userId, problemId);
          }
        });
      }
      // Get Submissions from db
      const response = await axios(
        `/api/problems/${problemId}/submissions/${userId}`,
      );
      if (response) {
        const submissions = response.data;
        set((state) => ({
          problems: {
            ...state.problems,
            [problemId]: {
              ...state.problems[problemId],
              submissions,
            },
          },
        }));
      } else {
        console.error("Error while fetching submissions: ", response);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  },
}));

interface ShownProblemIdContext {
  shownProblemId: string;
  setShownProblemId: (problemId: string) => void;
}
export const useShownProblemId = create<ShownProblemIdContext>((set, get) => ({
  shownProblemId: "",
  setShownProblemId: (problemId: string) => set({ shownProblemId: problemId }),
}));
