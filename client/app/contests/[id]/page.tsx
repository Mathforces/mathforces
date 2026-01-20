"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import ContestHeader from "@/components/Contest/Header";
import { BsTag } from "react-icons/bs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MainTaps, ProblemsTap } from "@/data/Contest_Content";
import GraphCalculator from "@/components/Tools/Graph_Calc";
import Problem_Statement_card from "@/components/Contest/Problem_Statement_card";
import { GrUploadOption } from "react-icons/gr";
import axios from "axios";
import { Contest, contestProblem, FullProblem } from "@/types/types";
import Loading from "@/components/ui/Loading";
import ProblemCard from "@/components/Contest/Problem_Card";

export default function Page() {
  const isMobile = useIsMobile();
  const { id: contest_id } = useParams();
  const router = useRouter();
  const contestParams = useSearchParams();
  const [showLevels, setShowLevels] = useState(false);

  const [contest, setContest] = useState<Contest | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<contestProblem[]>([]);

  const problemId = contestParams.get("problemId") || null;
  const [shownProblem, setShownProblem] = useState<number | null>(
    Number(problemId),
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
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/contests/${contest_id}`);
        console.log(response);
        setContest(response.data);
      } catch (err: any) {
        console.error("Error fetching contest:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load contest. Please try again.",
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
        if (response) {
          if (!shownProblem) {
            setShownProblem(response.data[0].id);
          }
          setProblems(response.data);
        }
      } catch (err: any) {
        console.error("Error fetching problems:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load problems. Please try again.",
        );
      }
    };
    fetchProblems();
  }, [contest_id]);


  useEffect(() => {
    if (showLevels) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLevels]);

  useEffect(() => {
    if (shownProblem) {
      if (shownProblem != Number(contestParams.get("problemId"))) {
        router.push(`?problemId=${shownProblem}`);
      }
    }
  }, [shownProblem]);
  if (loading) return <Loading title="Contest Problem" />;

  if (error) {
    return (
      <main className="flex flex-col justify-center items-center h-screen gap-4 px-3 text-center">
        <AlertCircle className="w-20 h-20 text-destructive" />
        <h1 className="text-2xl font-bold">Error Loading Contest</h1>
        <p className="text-lg text-muted-foreground max-w-md">{error}</p>
        <div className="mt-5 flex justify-center items-center gap-4">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Link href={"/contests"}>
            <Button variant="outline">Back to Contests</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!contest) {
    return (
      <main className="flex flex-col justify-center items-center h-screen gap-4 px-3 text-center">
        <div className="text-[150px] md:text-[200px] font-bold text-primary/20">
          404
        </div>
        <h1 className="mb-2">Contest Not Found</h1>
        <p className="md:text-lg lg:text-xl text-black/70">
          The contest you are looking for does not exist. Please check the name.
        </p>
        <div className="mt-5 flex justify-center items-center gap-4">
          <Link href={"/"}>
            <Button variant="primary">Home</Button>
          </Link>
          <Link href={"/contests"}>
            <Button variant="primary">Contests</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen! max-h-screen! max-w-full! px-3 flex flex-col py-1">
      {/* Contest Header */}
      <ContestHeader />

      {/* Problems Navigator for phones */}
      {isMobile && (
        <div className="fixed top-32 left-4 w-fit flex justify-center mb-3 z-50">
          <Button
            variant="primary"
            onClick={() => setShowLevels((prev) => !prev)}
          >
            Problems
            <Gauge size={35} strokeWidth={3} />
          </Button>
        </div>
      )}

      {/* Problems List Screen for phones */}
      <div
        className={`fixed top-0 left-0 bg-background px-4 rounded-2xl w-full mb-4 flex flex-col justify-center items-center gap-3 h-screen duration-150 ${
          isMobile && showLevels ? "opacity-100 z-10" : "opacity-0 -z-10"
        }`}
      >
        <h2 className="font-semibold text-center mb-2 flex justify-center items-center gap-2">
          <Gauge size={25} strokeWidth={3} className="text-primary" /> Levels
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {problems.map((problem) => (
            <Button
              key={problem.id}
              onClick={() => {
                setShowLevels(false);
              }}
              className="justify-start text-2xl"
            >
              {problem.name}
            </Button>
          ))}
        </div>
      </div>

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

                      <TabsContent
                        value="problems"
                        className="p-4 flex flex-col gap-3 w-full"
                      >
                        <div className="flex flex-col gap-3">
                          <h2 className="font-bold text-2xl">{contest.name}</h2>
                          <div className="flex gap-1">
                            <div className="bg-muted px-3 py-1 rounded-lg flex items-center justify-center">
                              {/* TODO: Customize this to have multiple colors according to the difficulty */}
                              <span className="text-destructive">
                                {contest.difficulty ?? "Unset"}
                              </span>
                            </div>
                            <div className="bg-muted px-2 py-1 rounded-lg flex items-center gap-1 justify-center">
                              <BsTag />
                              <span>Topics</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 w-full py-2 pr-2">
                          {problems.map((problem) => (
                            <div
                              onClick={() => setShownProblem(problem.id)}
                              className="w-full"
                            >
                              <ProblemCard
                                key={problem.id}
                                problem={problem}
                                setShownProblem={setShownProblem}
                                shownProblem={shownProblem}
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <ScrollBar />
                </ScrollArea>

                <section className="flex flex-col justify-center items-center gap-2">
                  <div className="flex items-center text-xs">
                    <Image
                      src="/Logo.png"
                      alt="Logo"
                      width={200}
                      height={200}
                      className="h-3 w-10 object-contain"
                    />
                    2026
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
                    <button
                      title="Im not a Link :>"
                      className="text-primary border-b border-primary"
                    >
                      Terms of use
                    </button>
                    <button
                      title="Im not a Link :>"
                      className="text-primary border-b border-primary"
                    >
                      Cookie notice
                    </button>
                    <button
                      title="Im not a Link :>"
                      className="text-primary border-b border-primary"
                    >
                      Privacy policy
                    </button>
                  </div>
                </section>
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

                  <Problem_Statement_card shownProblemId={shownProblem} />
                  <TabsContent value="graphingCalculator">
                    <GraphCalculator />
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

                  <TabsContent
                    value="submissions"
                    className="w-full h-full"
                  ></TabsContent>
                </Tabs>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
