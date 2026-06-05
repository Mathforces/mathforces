"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import { Contest, ContestProblem, getContestPhase } from "@/types/types";
import Loading from "@/components/ui/Loading";
import ContestSubmissions from "./submissions";
import ContestProblems from "./problems";
import ContestNotFound from "./contest_404";
import ContestError from "./contest_error";
import { useShownProblemId, useProblems } from "@/app/store";
import ContestStandings from "./standings";
import ScientificCalc from "@/components/Contest/scientificCalc";
import ComingSoon from "@/components/comingSoon";
import { FaHourglassStart } from "react-icons/fa6";

const bottomBarTabs = [
  {
    value: "submissions",
    label: "Submissions",
    icon: GrUploadOption,
    color: "text-secondary",
  },
];

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
  const previousProblemIdParam = useRef<string | null>(null);
  const [problemsStatus, setProblemsStatus] = useState<Record<string, string>>(
    {},
  );

  const [leftBarActiveTab, setLeftBarActiveTab] = useState("problems");
  const [bottomBarActiveTab, setBottomBarActiveTab] = useState("submissions");
  const [rightBarActiveTab, setRightBarActiveTab] =
    useState("problemStatement");
  const [mobileActiveTab, setMobileActiveTab] = useState("problemStatement");
  const [expressions, setExpressions] = useState<unknown>(null);
  const activeTabParam = contestParams.get("tab");
  const leftBarTabValues = useMemo(
    () =>
      ProblemsTap.filter((tab) => tab.status !== "coming soon").map(
        (tab) => tab.value,
      ),
    [],
  );
  const rightBarTabValues = useMemo(
    () =>
      MainTaps.filter((tab) => tab.status !== "coming soon").map(
        (tab) => tab.value,
      ),
    [],
  );
  const bottomBarTabValues = useMemo(
    () => bottomBarTabs.map((tab) => tab.value),
    [],
  );
  const mobileTabValues = useMemo(
    () => [
      "problemStatement",
      ...leftBarTabValues,
      ...rightBarTabValues,
      ...bottomBarTabValues,
    ],
    [bottomBarTabValues, leftBarTabValues, rightBarTabValues],
  );
  const prevLocalStorage = useRef<Record<string, string> | null>(null);

  const pushTabParam = (tab: string) => {
    const params = new URLSearchParams(contestParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const changeLeftBarTab = (tab: string) => {
    setLeftBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeRightBarTab = (tab: string) => {
    setRightBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeBottomBarTab = (tab: string) => {
    setBottomBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeMobileTab = (tab: string) => {
    setMobileActiveTab(tab);
    pushTabParam(tab);
  };
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
  }, [contest_id]);


  useEffect(() => {
    if (!contest) return;

    let ignore = false;

    const fetchProblems = async () => {
      try {
        setError(null);

        const response = await axios.get(
          `/api/contests/${contest_id}/problems`,
        );
        if (!ignore && response?.data) {
          setProblems(response.data as ContestProblem[]);
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error("Error fetching problems:", err);
          setError(
            getErrorMessage(err, "Failed to load problems. Please try again."),
          );
        }
      }
    };
    fetchProblems();

    return () => {
      ignore = true;
    };
  }, [contest, contest_id]);


  useEffect(() => {
    if (problems.length === 0) return;

    const hasProblem = (id: string | null) =>
      Boolean(id && problems.some((problem) => problem.id === id));
    const problemIdParamChanged = previousProblemIdParam.current !== problemId;
    previousProblemIdParam.current = problemId;

    const urlProblemId = hasProblem(problemId) ? problemId : null;
    const selectedProblemId = hasProblem(shownProblemId)
      ? shownProblemId
      : null;
    const nextProblemId =
      problemIdParamChanged && urlProblemId
        ? urlProblemId
        : selectedProblemId ?? urlProblemId ?? problems[0].id;

    if (!nextProblemId) return;

    if (shownProblemId !== nextProblemId) {
      setShownProblemId(nextProblemId);
    }

    if (problemId !== nextProblemId) {
      const params = new URLSearchParams(contestParams.toString());
      params.set("problemId", nextProblemId);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    contestParams,
    problemId,
    problems,
    router,
    setShownProblemId,
    shownProblemId,
  ]);

  useEffect(() => {
    if (!activeTabParam) return;

    if (mobileTabValues.includes(activeTabParam)) {
      setMobileActiveTab(activeTabParam);
    }

    if (leftBarTabValues.includes(activeTabParam)) {
      setLeftBarActiveTab(activeTabParam);
    }

    if (rightBarTabValues.includes(activeTabParam)) {
      setRightBarActiveTab(activeTabParam);
    }

    if (bottomBarTabValues.includes(activeTabParam)) {
      setBottomBarActiveTab(activeTabParam);
    }
  }, [
    activeTabParam,
    bottomBarTabValues,
    leftBarTabValues,
    mobileTabValues,
    rightBarTabValues,
  ]);

  // logging and importing problemsStatement to and from Local Storage
  useEffect(() => {
    if (Object.keys(problemsStatus).length > 0) {
      if (problemsStatus === prevLocalStorage.current) return;
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
          prevLocalStorage.current = JSON.parse(data);
          setProblemsStatus(JSON.parse(data));
        }
      }
    }
  }, [problemsStatus, contest]);

  // Poll for phase changes every 10 seconds (MUST be before early returns — hooks rule)
  const [pollNow, setPollNow] = useState(Date.now());
  useEffect(() => {
    const mode = contest?.mode;
    if (mode !== "live") return;
    const interval = setInterval(() => setPollNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, [contest?.mode]);

  // Ref to track whether we've already redirected on contest end (MUST be before early returns)
  const contestEndedRef = useRef(false);
  useEffect(() => {
    if (!contest || contest.mode !== "live") {
      contestEndedRef.current = false;
      return;
    }
    const phase = getContestPhase(contest);
    if (phase === "ended" && !contestEndedRef.current) {
      contestEndedRef.current = true;
      // Clear localStorage caches for this contest
      try {
        if (typeof window !== "undefined") {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(`input-problem-`) || key.startsWith(`problem_${contest.id}_`))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));
          localStorage.removeItem(`problemsStatus-${contest.id}`);
        }
      } catch {}

      // Redirect to standings
      const params = new URLSearchParams(contestParams.toString());
      params.set("tab", "standings");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [contest, contestParams, router, pollNow]);

  if (loading) return <Loading title="Contest Problem" />;

  if (error) {
    return <ContestError error={error} />;
  }

  if (!contest) {
    return <ContestNotFound />;
  }

  const contestPhase = getContestPhase(contest);

  // For live upcoming contests, show a waiting state
  if (contest.mode === "live" && contestPhase === "upcoming") {
    return (
      <main className="h-screen flex flex-col">
        <ContestHeader
          start_date={contest.start_date}
          end_date={contest.end_date}
          mode={contest.mode}
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <FaHourglassStart className="w-16 h-16 text-amber-500 animate-pulse" />
          <h1 className="text-3xl font-bold text-center">{contest.name}</h1>
          <p className="text-lg text-muted-foreground text-center max-w-md">
            This contest hasn&apos;t started yet. Check back when the countdown reaches zero!
          </p>
          {/* Timer already shown in the header above */}
          <ContestStandings contestId={contest.id} />
        </div>
      </main>
    );
  }

  if (isMobile) {
    return (
      <main className="h-[100svh] max-w-full px-2 py-1 flex flex-col overflow-hidden">
        <ContestHeader
          start_date={contest.start_date}
          end_date={contest.end_date}
          mode={contest.mode}
        />

        <Tabs
          value={mobileActiveTab}
          onValueChange={changeMobileTab}
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
              <ComingSoon disabled={false}>
                <TabsTrigger
                  value="graphingCalculator"
                  className="h-9 shrink-0"
                  disabled
                >
                  Graph
                </TabsTrigger>
              </ComingSoon>
              <ComingSoon disabled={false}>
                <TabsTrigger
                  value="scientificCalculator"
                  className="h-9 shrink-0"
                  disabled
                >
                  Calc
                </TabsTrigger>
              </ComingSoon>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="min-h-0 flex-1 overflow-hidden">
            {mobileActiveTab == "problemStatement" && (
              <Problem_Statement_card
                setProblemsStatus={setProblemsStatus}
                problemsStatus={problemsStatus}
                contestEnded={contestPhase === "ended"}
              />
            )}

            {mobileActiveTab == "problems" && (
              <ScrollArea className="h-full">
                <ContestProblems
                  contest={contest}
                  problems={problems}
                  problemsStatus={problemsStatus}
                  onProblemSelect={() => changeMobileTab("problemStatement")}
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
      <ContestHeader
        start_date={contest.start_date}
        end_date={contest.end_date}
        mode={contest.mode}
      />

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
                      onValueChange={changeLeftBarTab}
                    >
                      <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                        {ProblemsTap.map((tab, i) => (
                          <Fragment key={tab.value}>
                            <ComingSoon disabled={tab.status != "coming soon"}>
                              <TabsTrigger
                                value={tab.value}
                                className="h-full rounded-none bg-transparent! max-w-fit"
                                disabled={tab.status == "coming soon"}
                              >
                                <tab.icon className={`${tab.color} w-4 h-4`} />
                                <span className="hidden md:inline text-xs xl:text-sm">
                                  {tab.label}
                                </span>
                              </TabsTrigger>
                            </ComingSoon>
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
                  onValueChange={changeRightBarTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {MainTaps.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <ComingSoon disabled={tab.status != "coming soon"}>
                          <TabsTrigger
                            value={tab.value}
                            className="h-full rounded-none bg-transparent! max-w-fit"
                            disabled={tab.status == "coming soon"}
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
                        </ComingSoon>
                      </Fragment>
                    ))}
                  </TabsList>

                  <Problem_Statement_card
                    setProblemsStatus={setProblemsStatus}
                    problemsStatus={problemsStatus}
                    contestEnded={contestPhase === "ended"}
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
                  onValueChange={changeBottomBarTab}
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
