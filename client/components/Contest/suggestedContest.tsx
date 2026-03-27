"use client";
import { Contest } from "@/types/types";
import { Radical } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import axios from "axios";
import { useProfile } from "@/app/store";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import ContestListing from "@/app/contests/contestListing";
import { ScrollArea } from "../ui/scroll-area";
import useInfiniteScroll from "@/hook/useInfiniteScroll";

interface Props {}
const SuggestedContest = ({}: Props) => {
  const userId = useProfile((state) => state.user?.id);
  const [contestTypeTab, setContestTypeTab] = useState("upcoming_contests");
  const handleRegister = async (contestId: string) => {
    axios
      .post(`/api/contests/${contestId}/registered`, { user_id: userId })
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
          toast.error("You are already registered to this contest");
        } else {
          toast.error("Error Occured while registering to contest");
        }
      });
  };
  // const [upComingContests, setUpComingContests] = useState<Contest[] | null>(
  //   null,
  // );
  const [pastContests, setPastContests] = useState<Contest[] | null>(null);

  const {
    items: upComingContests,
    loading: upComingLoading,
    observerTarget: UpcomingObserver,
  } = useInfiniteScroll({
    apiUrl: "/api/contests/upcoming",
    options: { limit: 5 },
  });
  // Handle error
  return (
    <section className="w-full md:w-3/4 max-w-xl flex flex-col gap-5 my-5">
      <Tabs
        defaultValue="upcoming_contests"
        value={contestTypeTab}
        onValueChange={setContestTypeTab}
      >
        <Card className="pt-3 border-none">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="upcoming_contests">
                Upcoming Contests
              </TabsTrigger>
              <TabsTrigger value="past_contests">Past Contests</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="upcoming_contests">
              {/* TODO: Change this to upcoming contests only  */}
              <ScrollArea className="h-60">
                <div className="space-y-3">
                  {upComingContests ? (
                    upComingContests.map((contest: Contest, i: number) => (
                      <ContestListing
                        key={contest?.id ?? i}
                        contest={contest}
                      />
                    ))
                  ) : (
                    <div>
                      <span>There are no contests to show</span>
                    </div>
                  )}
                  <div ref={UpcomingObserver}></div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="past_contests">
              {/* TODO: Change this to past contests only  */}
              {/* <div className="space-y-3"> */}
              {/*   {contests.map((contest, i) => ( */}
              {/*     <ContestListing key={contest?.id ?? i} contest={contest} /> */}
              {/*   ))} */}
              {/* </div> */}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  );
};

export default SuggestedContest;
