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
import Loading from "../ui/Loading";
import { Loader2 } from "lucide-react";

interface Props {}
type ContestTypeTab = "upcoming_contests" | "past_contests" | "all";
const SuggestedContest = ({}: Props) => {
  const userId = useProfile((state) => state.user?.id);
  const [contestTypeTab, setContestTypeTab] =
    useState<ContestTypeTab>("upcoming_contests");
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

  const {
    items: upComingContests,
    loading: upComingContestsLoading,
    observerTarget: UpcomingContestsObserver,
    loadMore: upComingContestLoadMore,
    isInitialized: upComingContestsIsInitialized,
  } = useInfiniteScroll({
    apiUrl: "/api/contests/upcoming",
    options: { limit: 5, autoFetch: false },
  });

  const {
    items: pastContests,
    loading: pastContestsLoading,
    observerTarget: pastContestsObserver,
    loadMore: pastContestLoadMore,
    isInitialized: pastContestsIsInitialized,
  } = useInfiniteScroll({
    apiUrl: "/api/contests/past",
    options: { limit: 5, autoFetch: false },
  });

  useEffect(() => {
    if (
      contestTypeTab === "upcoming_contests" &&
      !upComingContestsIsInitialized
    ) {
      upComingContestLoadMore();
    } else if (
      contestTypeTab === "past_contests" &&
      !pastContestsIsInitialized
    ) {
      pastContestLoadMore();
    }
  }, [contestTypeTab]);
  // Handle error
  return (
    <section className="w-full md:w-3/4 max-w-xl flex flex-col gap-5 my-5">
      <Tabs
        defaultValue="upcoming_contests"
        value={contestTypeTab}
        onValueChange={(e: any) => setContestTypeTab(e)}
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
              <ScrollArea className="h-60">
                <div className="">
                  {upComingContests && upComingContests.length > 0 ? (
                    <div className="space-y-3">
                      {upComingContests.map((contest: Contest, i: number) => (
                        <ContestListing
                          key={contest?.id ?? i}
                          contest={contest}
                        />
                      ))}
                      {upComingContestsLoading && (
                        <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
                      )}
                    </div>
                  ) : upComingContestsLoading ? (
                    <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
                  ) : (
                    <div>
                      <span>There are no contests to show</span>
                    </div>
                  )}
                  <div ref={UpcomingContestsObserver}></div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="past_contests">
              <ScrollArea className="h-60">
                <div className="">
                  {pastContests ? (
                    <div className="space-y-3">
                      {pastContests.map((contest: Contest, i: number) => (
                        <ContestListing
                          key={contest?.id ?? i}
                          contest={contest}
                        />
                      ))}
                      {pastContestsLoading && (
                        <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
                      )}
                    </div>
                  ) : pastContestsLoading ? (
                    <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
                  ) : (
                    <div>
                      <span>There are no contests to show</span>
                    </div>
                  )}
                  <div ref={pastContestsObserver}></div>
                </div>
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  );
};

export default SuggestedContest;
