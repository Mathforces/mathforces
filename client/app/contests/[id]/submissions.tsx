"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import SubmissionsTable from "@/components/Contest/submissionRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, dateFormatter } from "@/lib/utils";
import { defaultFormattedDate } from "@/types/types";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import * as React from "react";

import { ContestPhase } from "@/lib/contest";

interface ContestSubmissionsProps {
  contestPhase?: ContestPhase;
}

const ContestSubmissions: React.FunctionComponent<ContestSubmissionsProps> = (
  props,
) => {
  const { contestPhase } = props;
  const { id: contest_id } = useParams();
  const [submissionType, setSubmissionType] = useState("your_submissions");
  const [officialOnly, setOfficialOnly] = useState(false);
  return (
    <TabsContent
      value="submissions"
      className="w-full h-full p-2 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-md bg-bg-light p-0.5">
          <button
            onClick={() => setOfficialOnly(false)}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              !officialOnly
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setOfficialOnly(true)}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              officialOnly
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Official
          </button>
        </div>
      </div>
      <ScrollArea className="h-full">
        <Tabs
          className="h-full"
          defaultValue="your_submissions"
          value={submissionType}
          onValueChange={setSubmissionType}
        >
          <TabsList>
            <TabsTrigger value="your_submissions">Your submissions</TabsTrigger>
            {/* TODO: Implement Friends submissions */}

            {/* <TabsTrigger value="friends_submissions"> */}
            {/*   Friends submissions */}
            {/* </TabsTrigger> */}
            <TabsTrigger value="general_submissions">
              General submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="your_submissions">
            <SubmissionsTable
              type="your_submissions"
              setSubmissionType={setSubmissionType}
              contestPhase={contestPhase}
              officialOnly={officialOnly}
            />
          </TabsContent>

          <TabsContent value="general_submissions">
            <SubmissionsTable
              type="general_submissions"
              setSubmissionType={setSubmissionType}
              contestId={contest_id as string}
              contestPhase={contestPhase}
              officialOnly={officialOnly}
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </TabsContent>
  );
};

export default ContestSubmissions;
