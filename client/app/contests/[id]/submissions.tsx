"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProblems, useShownProblemId } from "@/app/store";
import { TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

interface ContestSubmissionsProps {}

const ContestSubmissions: React.FunctionComponent<ContestSubmissionsProps> = (
  props,
) => {
  const shownProblemId = useShownProblemId((state) => state.shownProblemId);
  const submissions = useProblems(
    (state) => state.problems[shownProblemId]?.submissions,
  );
  const {user} = useUser();
  useEffect(() => {
    if (user && shownProblemId) {
      useProblems.getState().fetchProblemSubmissions(user.id, shownProblemId);
    }
  }, [user, shownProblemId]);
  return (
    <TabsContent value="submissions" className="w-full h-full p-2 flex flex-col gap-4">
      {submissions?.map((submission) => (
        <div key={submission.id}>
          <p>{submission.user_answer}</p>
          <p>{submission.status}</p>
        </div>
      ))}
    </TabsContent>
  );
};

export default ContestSubmissions;
