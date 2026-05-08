"use client";
import { Fragment, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ContestHeader from "@/components/Contest/Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MainTaps, ProblemsTap } from "@/data/Contest_Content";
import GraphCalculator from "@/components/Tools/Graph_Calc";
import Problem_Statement_card from "@/components/Contest/Problem_Statement_card";
import { GrUploadOption } from "react-icons/gr";
import axios from "axios";
import { Contest, ContestProblem } from "@/types/types";
import Loading from "@/components/ui/Loading";
import ContestSubmissions from "./submissions";
import ContestProblems from "./problems";
import ContestNotFound from "./contest_404";
import ContestError from "./contest_error";
import { useShownProblemId } from "@/app/store";
import ContestStandings from "./standings";
import ScientificCalc from "@/components/Contest/scientificCalc";

export default function Page() {
  const isMobile = useIsMobile();
  const { id: contest_id } = useParams();
  const router = useRouter();
  const contestParams = useSearchParams();

  const [contest, setContest] = useState<Contest | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<ContestProblem[]>([]);
  const { shownProblemId, setShownProblemId } = useShownProblemId();
  const problemId = contestParams.get("problemId") ?? null;
  const [problemsStatus, setProblemsStatus] = useState<Record<string, string>>(
    {},
  );

  const bottomBarTabs = [
    {
      value: "submissions",
      label: "Submissions",
      icon: GrUploadOption,
      color: "text-secondary",
    },
  ];

  const [leftBarActiveTab, setLeftBarActiveTab] = useState("problems");
  const [bottomBarActiveTab, setBottomBarActiveTab] = useState("submissions");
  const [rightBarActiveTab, setRightBarActiveTab] =
    useState("problemStatement");
  const [mobileActiveTab, setMobileActiveTab] = useState("problemStatement");
  const [expressions, setExpressions] = useState<unknown>(null);
  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      return err.response?.data?.message || fallback;
    }

    return fallback;
  };
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/contests/${contest_id}`);
        setContest(response.data);
      } catch (err: unknown) {
        console.error("Error fetching contest:", err);
        setError(
          getErrorMessage(err, "Failed to load contest. Please try again."),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContest();

    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/contests/${contest_id}/problems`,
        );
        if (response && response.data) {
          const problemsTemp = response.data as ContestProblem[];

          // problemsTemp.sort((a: ContestProblem, b: ContestProblem) => {
          //   return a.index_in_contest - b.index_in_contest;
          // });

          setProblems(problemsTemp);
        }
      } catch (err: unknown) {
        console.error("Error fetching problems:", err);
        setError(
          getErrorMessage(err, "Failed to load problems. Please try again."),
        );
      }
    };
    fetchProblems();
  }, [contest_id]);

  useEffect(() => {
    if (shownProblemId) {
      if (
        problems.length > 0 &&
        problems.filter((e) => e.id == shownProblemId).length < 1
      ) {
        setShownProblemId(problems[0].id);
      }
    } else if (problemId) {
      setShownProblemId(problemId);
    } else if (problems.length > 0) {
      setShownProblemId(problems[0].id);
    }
  }, [shownProblemId, problems]);

  useEffect(() => {
    if (problemId) {
      if (
        problems.length > 0 &&
        problems.filter((e) => e.id == problemId).length < 1
      ) {
        setShownProblemId(problems[0].id);
      }
      if (shownProblemId != problemId) {
        router.push(`?problemId=${shownProblemId}`);
        setShownProblemId(problemId);
      }
    }
  }, []);

  // logging and importing problemsStatement to and from Local Storage
  let prevLocalStorage: Record<string, string> | null = null;

  useEffect(() => {
    if (Object.keys(problemsStatus).length > 0) {
      if (problemsStatus === prevLocalStorage) return;
      if (contest && typeof window !== "undefined") {
        localStorage.setItem(
          `problemsStatus-${contest.id}`,
          JSON.stringify(problemsStatus),
        );
      }
    } else {
      if (contest) {
        const data = localStorage.getItem(`problemsStatus-${contest.id}`);
        if (data) {
          prevLocalStorage = JSON.parse(data);
          setProblemsStatus(JSON.parse(data));
        }
      }
    }
  }, [problemsStatus, contest]);

  if (loading) return <Loading title="Contest Problem" />;

  if (error) {
    return <ContestError error={error} />;
  }

  if (!contest) {
    return <ContestNotFound />;
  }

  if (isMobile) {
    return (
      <main className="h-[100svh] max-w-full px-2 py-1 flex flex-col overflow-hidden">
        <ContestHeader length_in_minutes={contest.length_in_minutes} />

        <Tabs
          value={mobileActiveTab}
          onValueChange={setMobileActiveTab}
          className="min-h-0 flex-1 flex flex-col rounded-sm bg-card"
        >
          <ScrollArea className="w-full shrink-0 border-b border-border/50">
            <TabsList className="flex h-11 w-max min-w-full justify-start rounded-none bg-bg-light px-1">
              <TabsTrigger value="problemStatement" className="h-9 shrink-0">
                Statement
              </TabsTrigger>
              <TabsTrigger value="problems" className="h-9 shrink-0">
                Problems
              </TabsTrigger>
              <TabsTrigger value="standings" className="h-9 shrink-0">
                Standings
              </TabsTrigger>
              <TabsTrigger value="submissions" className="h-9 shrink-0">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="graphingCalculator" className="h-9 shrink-0">
                Graph
              </TabsTrigger>
              <TabsTrigger
                value="scientificCalculator"
                className="h-9 shrink-0"
              >
                Calc
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Problem_Statement_card
              setProblemsStatus={setProblemsStatus}
              problemsStatus={problemsStatus}
            />

            {mobileActiveTab == "problems" && (
              <ScrollArea className="h-full">
                <ContestProblems
                  contest={contest}
                  problems={problems}
                  problemsStatus={problemsStatus}
                  onProblemSelect={() => setMobileActiveTab("problemStatement")}
                />
              </ScrollArea>
            )}

            {mobileActiveTab == "standings" && (
              <ScrollArea className="h-full">
                <ContestStandings contestId={contest.id} />
              </ScrollArea>
            )}

            <ContestSubmissions />

            <TabsContent value="graphingCalculator" className="h-full m-0">
              <GraphCalculator
                expressions={expressions}
                setExpressions={setExpressions}
              />
            </TabsContent>

            <TabsContent value="scientificCalculator" className="h-full m-0">
              <ScientificCalc />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    );
  }

  return (
    <main className="h-screen! max-h-screen! max-w-full! px-1 flex flex-col py-1">
      {/* Contest Header */}
      <ContestHeader length_in_minutes={contest.length_in_minutes} />

      <ResizablePanelGroup direction="horizontal" className="flex flex-1">
        {/* Left Sidebar for Desktop  */}
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card">
                <ScrollArea className="h-full" type="always">
                  <div className="h-full rounded-2xl w-full space-y-3">
                    <Tabs
                      defaultValue="problems"
                      className="w-full"
                      value={leftBarActiveTab}
                      onValueChange={setLeftBarActiveTab}
                    >
                      <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                        {ProblemsTap.map((tab, i) => (
                          <Fragment key={tab.value}>
                            <TabsTrigger
                              value={tab.value}
                              className="h-full rounded-none bg-transparent! max-w-fit"
                            >
                              <tab.icon className={`${tab.color} w-4 h-4`} />
                              <span className="hidden md:inline text-xs xl:text-sm">
                                {tab.label}
                              </span>
                            </TabsTrigger>

                            {i < ProblemsTap.length - 1 && (
                              <Separator
                                orientation="vertical"
                                className="h-4! bg-foreground/20"
                              />
                            )}
                          </Fragment>
                        ))}
                      </TabsList>

                      {/* Problems */}
                      {leftBarActiveTab == "problems" && (
                        <ContestProblems
                          contest={contest}
                          problems={problems}
                          problemsStatus={problemsStatus}
                        />
                      )}

                      {leftBarActiveTab == "standings" && (
                        <ContestStandings contestId={contest.id} />
                      )}
                    </Tabs>
                  </div>
                  <ScrollBar />
                </ScrollArea>
              </section>
            </ResizablePanel>
            <ResizableHandle className="w-2 bg-transparent hover:bg-sidebar-border/60" />
          </>
        )}

        {/* Right Sidebar */}
        <ResizablePanel defaultSize={isMobile ? 100 : 70}>
          <ResizablePanelGroup direction="vertical" className="flex flex-col">
            {/* Top-right section (problem statements) */}
            <ResizablePanel defaultSize={70}>
              <section className="w-full h-full rounded-sm bg-card">
                <Tabs
                  defaultValue="problemStatement"
                  className="w-full h-full"
                  value={rightBarActiveTab}
                  onValueChange={setRightBarActiveTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {MainTaps.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <TabsTrigger
                          value={tab.value}
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <tab.icon className={`${tab.color} w-4 h-4`} />
                          <span className="hidden md:inline text-xs xl:text-sm">
                            {tab.label}
                          </span>
                        </TabsTrigger>
                        {i < MainTaps.length - 1 && (
                          <Separator
                            orientation="vertical"
                            className="h-4! bg-foreground/20"
                          />
                        )}
                      </Fragment>
                    ))}
                  </TabsList>

                  <Problem_Statement_card
                    setProblemsStatus={setProblemsStatus}
                    problemsStatus={problemsStatus}
                  />

                  <TabsContent value="graphingCalculator">
                    <GraphCalculator
                      expressions={expressions}
                      setExpressions={setExpressions}
                    />
                  </TabsContent>

                  <TabsContent value="scientificCalculator">
                    <ScientificCalc />
                  </TabsContent>
                </Tabs>
              </section>
            </ResizablePanel>

            <ResizableHandle className="bg-transparent h-2! hover:bg-sidebar-border/60" />
            {/* Bottom-right section (Submissions) */}
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card">
                <Tabs
                  defaultValue="submissions"
                  className="w-full h-full"
                  value={bottomBarActiveTab}
                  onValueChange={setBottomBarActiveTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {bottomBarTabs.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <TabsTrigger
                          value={tab.value}
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <tab.icon className={`${tab.color} w-4 h-4`} />
                          <span className="hidden md:inline text-xs xl:text-sm">
                            {tab.label}
                          </span>
                        </TabsTrigger>
                        {i < bottomBarTabs.length - 1 && (
                          <Separator
                            orientation="vertical"
                            className="h-4! bg-foreground/20"
                          />
                        )}
                      </Fragment>
                    ))}
                  </TabsList>
                  <ContestSubmissions />
                </Tabs>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
