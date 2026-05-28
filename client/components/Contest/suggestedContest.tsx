"use client";
import { Contest } from "@/types/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useMemo, useState } from "react";
import ContestListing from "@/app/contests/contestListing";
import { ScrollArea } from "../ui/scroll-area";
import useInfiniteScroll from "@/hook/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";
import MobileContentListing from "@/app/contests/mobileContentListing";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type ContestTypeTab = "upcoming_contests" | "past_contests" | "all";

const dedupeContests = (contests: Contest[] | null) => {
  if (!contests) return null;

  const seen = new Set<string>();
  return contests.filter((contest) => {
    if (seen.has(contest.id)) return false;
    seen.add(contest.id);
    return true;
  });
};

const SuggestedContest = () => {
  const [contestTypeTab, setContestTypeTab] =
    useState<ContestTypeTab>("upcoming_contests");
  const isMobile = useIsMobile();

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
  const uniqueUpcomingContests = useMemo(
    () => dedupeContests(upComingContests),
    [upComingContests],
  );
  const uniquePastContests = useMemo(
    () => dedupeContests(pastContests),
    [pastContests],
  );
  const activeContestTypeTab =
    contestTypeTab === "upcoming_contests" &&
    upComingContestsIsInitialized &&
    !upComingContestsLoading &&
    uniqueUpcomingContests?.length === 0
      ? "past_contests"
      : contestTypeTab;

  useEffect(() => {
    if (
      activeContestTypeTab === "upcoming_contests" &&
      !upComingContestsIsInitialized
    ) {
      upComingContestLoadMore();
    } else if (
      activeContestTypeTab === "past_contests" &&
      !pastContestsIsInitialized
    ) {
      pastContestLoadMore();
    }
  }, [
    activeContestTypeTab,
    pastContestLoadMore,
    pastContestsIsInitialized,
    upComingContestLoadMore,
    upComingContestsIsInitialized,
  ]);
  // Handle error
  const router = useRouter();
  return (
    <section className="w-full md:w-3/4 max-w-xl flex flex-col gap-5 my-5">
      <Tabs
        defaultValue="upcoming_contests"
        value={activeContestTypeTab}
        onValueChange={(value) => setContestTypeTab(value as ContestTypeTab)}
      >
        <Card className="border-none *:px-3">
          <CardHeader className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="upcoming_contests">
                Upcoming Contests
              </TabsTrigger>
              <TabsTrigger value="past_contests">Past Contests</TabsTrigger>
            </TabsList>
            <Button onClick={() => router.push("/create_contest")}>
              Create
            </Button>
          </CardHeader>
          <CardContent>
            <TabsContent value="upcoming_contests">
              <ScrollArea className="h-100">
                <div>
                  {uniqueUpcomingContests &&
                  uniqueUpcomingContests.length > 0 ? (
                    <div className="space-y-5">
                      {uniqueUpcomingContests.map((contest: Contest) => (
                        <ContestListing
                          key={contest.id}
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
                      <span>
                        There are no upcoming contests as of now. Please check{" "}
                        <button
                          className="underline text-primary cursor-pointer"
                          onClick={() => setContestTypeTab("past_contests")}
                        >
                          Past contests
                        </button>
                      </span>
                    </div>
                  )}
                  <div ref={UpcomingContestsObserver}></div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="past_contests">
              <ScrollArea className="h-100">
                <div>
                  {uniquePastContests ? (
                    <div className="space-y-5">
                      {uniquePastContests.map((contest: Contest) => (
                        <div key={contest.id}>
                          {isMobile ? (
                            <MobileContentListing
                              contest={contest}
                            />
                          ) : (
                            <ContestListing contest={contest} />
                          )}
                        </div>
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
