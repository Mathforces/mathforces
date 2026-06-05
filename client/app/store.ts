import { supabase } from "@/lib/supabase/client";
import { getFormattedDate } from "@/lib/utils";
import {
  ProblemCore,
  Submission,
  SUBMISSION_TYPES,
  SubmissionsTypes,
  UserProfile,
} from "@/types/types";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { create } from "zustand";

let authListenerInitialized = false;

export interface UserProfileContext {
  user: User | null;
  userProfile: UserProfile | null;
  isWithoutUsername: boolean;
  initialize: () => Promise<void>;
  createProfile: (
    userProfile: UserProfile,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (userProfile: UserProfile) => Promise<void>;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const useProfile = create<UserProfileContext>((set, get) => ({
  user: null,
  userProfile: null,
  loading: false,
  isWithoutUsername: false,

  initialize: async () => {
    if (!authListenerInitialized) {
      authListenerInitialized = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        set(() => ({ user }));

        if (user) {
          setTimeout(() => {
            void get().initialize();
          }, 0);
        } else {
          set(() => ({
            userProfile: null,
            isWithoutUsername: false,
            loading: false,
          }));
        }
      });
    }

    set(() => ({
      loading: true,
    }));

    // Get the user session from Supabase (to get the userID)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error fetching auth user:", userError);

      set(() => ({ loading: false }));
      return;
    }
    set(() => ({ user }));

    // get the user profile from supabase
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);

      // Checking if user signed in using a provider but didn't enter a username
      if (user?.app_metadata.provider !== "email") {
        set(() => ({ isWithoutUsername: true }));
        redirect("/get_username");
      }
      set(() => ({ loading: false }));
      return;
    }

    // If no Errors set userprofile
    set(() => ({ userProfile }));
    set(() => ({ isWithoutUsername: false }));
    set(() => ({ loading: false }));
  },

  createProfile: async (userProfile: UserProfile) => {
    let profileError = "No userprofile provided";
    let ok = false;
    if (userProfile) {
      try {
        const res = await axios.post(
          `/api/auth/signup/create_profile`,
          userProfile,
        );
        if (res) {
          ok = true;
          profileError = "";
          set(() => ({ userProfile: res.data.profileData }));
          set(() => ({ isWithoutUsername: false }));
        }
      } catch (err: unknown) {
        if (axios.isAxiosError<{ error?: string }>(err) && err.response?.data.error) {
          if (
            err.response.data.error ===
            'duplicate key value violates unique constraint "profiles_pkey"'
          ) {
            profileError =
              "An Account with those credentials already exists. Please sign in instead.";
          } else {
            profileError = err.response.data.error;
          }
        } else {
          profileError = "Sign in failed. Please try again.";
        }
        console.error("Sign in error:", err);
        ok = false;
      }
    }
    return { ok, error: profileError };
  },

  updateProfile: async (userProfile: UserProfile) => {
    if (userProfile) {
      axios
        .post(`/api/auth/signup/update_profile`, userProfile)
        .then((res) => {
          if (res) {
            set(() => ({ userProfile: res.data.profileData }));
            toast("Successfully Updated Profile!");
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.error) {
            toast.error(err.response.data.error);
          } else {
            toast.error("Profile update failed. Please try again.");
          }
          console.error("Profile update error:", err);
        });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      set(() => ({ userProfile: null, user: null }));
    }
  },
}));

interface Problem {
  core: ProblemCore;
  coreLoading: boolean;
  submissions: {
    general_submissions: Submission[];
    your_submissions: Submission[];
    friends_submissions: Submission[];
    loading: boolean;
  };
}
interface ContestProblemsContext {
  problems: Record<string, Problem>;
  fetchCore: (problemId: string) => Promise<void>;
  fetchProblemSubmissions: (
    problemId: string,
    type?: SubmissionsTypes,
    userId?: string,
    contestId?: string,
  ) => Promise<void>;
  updateProblemSubmissions: (submission: Submission) => void;
}
export const useProblems = create<ContestProblemsContext>((set, get) => ({
  problems: {},
  coreLoading: false,

  // Fetch core of problem data [problem statement, problem Name, Problem Answer]
  fetchCore: async (problemId: string) => {
    // Check if it exists first
    const existingProblem = get().problems[problemId];
    if (existingProblem?.core && "description_latex" in existingProblem.core) {
      return;
    }

    // Get core data from DB. Do not cache this in localStorage because live
    // contest access can change as server time crosses start/end boundaries.
    {
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
  fetchProblemSubmissions: async (
    problemId: string,
    type?: SubmissionsTypes,
    userId?: string,
    contestId?: string,
  ) => {
    try {
      // check if it's saved
      const problem = get().problems[problemId];
      set((state) => ({
        problems: {
          ...state.problems,
          [problemId]: {
            ...state.problems[problemId],
            submissions: {
              ...state.problems[problemId].submissions,
              loading: true,
            },
          },
        },
      }));
      if (problem?.coreLoading == true) {
        // Check if core is still loading (in order not to interfere with the network request and give it privilege)
        const unsubscribe = useProblems.subscribe((state, prevState) => {
          const wasLoading = prevState.problems[problemId]?.coreLoading;
          const isLoading = state.problems[problemId]?.coreLoading;
          if (!isLoading && wasLoading) {
            unsubscribe();
            get().fetchProblemSubmissions(problemId, type, userId);
          }
        });
      }
      if (type) {
        let submissions: Submission[] = [];          if (type === "general_submissions") {
          try {
            const params: Record<string, string> = {};
            if (contestId) {
              params.contest_id = contestId;
            }
            const res = await axios.get(
              `/api/problems/${problemId}/submissions`,
              { params },
            );
            if (res.data) {
              console.log("Got general problem Submissions successfully");
              console.log(res.data);
              submissions = res.data;
            }
          } catch (err) {
            console.error(err);
          }
        } else if (type === "your_submissions") {
          try {
            if (userId) {
              const res = await axios(
                `/api/problems/${problemId}/submissions/${userId}`,
              );
              if (res) {
                submissions = res.data;
              }
            } else throw "User is not authenticated";
          } catch (err) {
            console.error("Error while fetching submissions: ", err);
          }
        }
        //TODO: Implement one for Friends Submissions

        submissions = submissions.map((submission) => {
          return {
            ...submission,
            formattedDate: getFormattedDate(submission.created_at),
          };
        });
        console.log("submissions_final: ", submissions);

        // Date sort
        submissions.sort(({ created_at: a }, { created_at: b }) => {
          return a < b ? 1 : a > b ? -1 : 0;
        });
        set((state) => ({
          problems: {
            ...state.problems,
            [problemId]: {
              ...state.problems[problemId],
              submissions: {
                ...state.problems[problemId].submissions,
                [type]: submissions,
                loading: false,
              },
            },
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  },

  updateProblemSubmissions: (submission: Submission) => {
    if (submission) {
      try {
        const { problem_id: problemId } = submission;
        submission.formattedDate = getFormattedDate(submission.created_at);
        if (problemId) {
          console.log("submission: ", submission);
          SUBMISSION_TYPES.forEach((t) => {
            const submissionsToUpdate =
              get().problems[problemId].submissions[t] ?? [];

            if (submissionsToUpdate) {
              submissionsToUpdate.unshift(submission);
              set((state) => ({
                problems: {
                  ...state.problems,
                  [problemId]: {
                    ...state.problems[problemId],
                    submissions: {
                      ...state.problems[problemId].submissions,
                      [t]: submissionsToUpdate,
                    },
                  },
                },
              }));
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    }
  },
}));

interface ShownProblemIdContext {
  shownProblemId: string;
  setShownProblemId: (problemId: string) => void;
}
export const useShownProblemId = create<ShownProblemIdContext>((set) => ({
  shownProblemId: "",
  setShownProblemId: (problemId: string) => set({ shownProblemId: problemId }),
}));
