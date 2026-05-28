"use client";

import { Contest } from "@/types/types";
import { Button } from "../ui/button";
import { useProfile } from "@/app/store";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { contest: Contest };

function No_solved_and_call_to_action({ contest }: Props) {
  const userId = useProfile((state) => state.user?.id);
  const router = useRouter();
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (!userId) return;

    const fetchSolvedCount = async () => {
      try {
        const res = await axios.get<{ solvedCount: number }>(
          `/api/contests/${contest.id}/solved-count`,
        );

        if (!ignore) {
          setSolvedCount(res.data.solvedCount);
        }
      } catch (error) {
        console.error("Error while fetching solved count: ", error);
        if (!ignore) {
          setSolvedCount(0);
        }
      }
    };

    fetchSolvedCount();

    return () => {
      ignore = true;
    };
  }, [contest.id, userId]);
  const displayedSolvedCount = userId ? solvedCount : 0;

  const handleRegister = async () => {
    if (userId) {
      axios
        .post(`/api/contests/${contest.id}/registered`, { user_id: userId })
        .then((res) => {
          if (res) {
            toast.success("Registered Successfully!");
          }
        })
        .catch((error) => {
          console.error(error);
          if (
            error.response.data.error.includes(
              "duplicate key value violates unique constraint",
            )
          ) {
            console.log("You are already registered to this contest");
          } else {
            console.error("Error Occured while registering to contest");
          }
        });
    }
    router.push(`/contests/${contest.id}`);
  };
  return (
    <div className="flex items-center gap-2">
      <div className="bg-bg-light rounded-md px-2 flex items-center">
        <span className="text-sm text-muted-foreground tracking-wider">
          {displayedSolvedCount}/{contest.problem_count}
        </span>
      </div>
      <Button
        className="bg-primary/25 border border-primary/75"
        onClick={() => handleRegister()}
      >
        Practice
      </Button>
    </div>
  );
}

export default No_solved_and_call_to_action;
