"use client";

import { Contest } from "@/types/types";
import { Button } from "../ui/button";
import { useProfile } from "@/app/store";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = { contest: Contest };

function No_solved_and_call_to_action({ contest }: Props) {
  const userId = useProfile((state) => state.user?.id);
  const router = useRouter();
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
        {/* TODO: Add the actual number of problems solved */}
        <span className="text-sm text-muted-foreground tracking-wider">
          {0}/{contest.problem_count}
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
