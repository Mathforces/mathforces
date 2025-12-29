"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  Gauge,
  MessageSquare,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import { ThemeButton } from "@/components/Theme-button";
import Logo from "@/components/ui/logo";
import ContestHeader from "@/components/header/contestHeader";
import { Progress } from "@/components/ui/progress";
import { BsTag } from "react-icons/bs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaBookOpen, FaLightbulb } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { MdLeaderboard } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
export default function Page() {
  const params = useParams();
  const isMobile = useIsMobile();

  const [showLevels, setShowLevels] = useState(false);
  const [progress, setProgress] = useState<number>(45);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [shownProblem, setShownProblem] = useState<Problem>();
  // Tabs
  const [leftBarActiveTab, setLeftBarActiveTab] = useState("problems");
  const [rightBarActiveTab, setRightBarActiveTab] =
    useState("problemStatement");
  const ContestInfo = {
    title: "Algebra Blitz 153",
    link: "/contests/beginner-problems",
    description:
      "A collection of problems suitable for beginners to get started with competitive programming.",
    difficulty: "Hard",
  };

  const sampleProblems = [
    {
      title: "A1",
      id: 1,
      like: 111,
      comments: 11,
      description:
        "Consider a circle Ω with radius 9 and center at the origin (0,0), and a disc ∆ with radius 1 and center at (r,0), where 0 ≤ r ≤ 8. Two points P and Q are chosen independently and uniformly at random on Ω. Which value(s) of r minimize the probability that the chord PQ intersects ∆?",
    },
    { title: "A2", id: 2, like: 222, comments: 22 },
    { title: "A3", id: 3, like: 333, comments: 33 },
    { title: "A4", id: 4, like: 333, comments: 33 },
    { title: "A5", id: 5, like: 555, comments: 55 },
    { title: "A6", id: 6, like: 333, comments: 33 },
    { title: "B1", id: 1, like: 111, comments: 11 },
    { title: "B2", id: 2, like: 111, comments: 11 },
    { title: "B3", id: 3, like: 333, comments: 33 },
    { title: "B4", id: 4, like: 555, comments: 55 },
    { title: "B5", id: 5, like: 555, comments: 55 },
    { title: "B6", id: 6, like: 222, comments: 22 },
  ];
  useEffect(() => {
    if (showLevels) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLevels]);

  // Set problems and shownProblem
  // TODO: fetch problems from API
  useEffect(() => {
    setProblems(sampleProblems);
    setShownProblem(sampleProblems[0]);
  }, []);
  const handleChange = (value: number[]) => setProgress(value[0]);
  const getTabStyle = (activeTab: string, currentTab: string) => {
    const activeTabStyle = "text-text opacity-100";
    const idleTabStyle = "opacity-70";
    if (activeTab.toLowerCase() == currentTab.toLowerCase()) {
      return activeTabStyle;
    }
    return idleTabStyle;
  };
  if (!ContestInfo) {
    return (
      <main className="">
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
      {/* Progress Section */}
      <ContestHeader />

      {/* Mobile: Button to toggle Levels */}
      {isMobile && (
        <div className="fixed top-32 left-4 w-fit flex justify-center mb-3 z-50">
          <Button
            variant="default"
            onClick={() => setShowLevels((prev) => !prev)}
            className="rounded-xl"
          >
            Levels
            <Gauge size={35} strokeWidth={3} />
          </Button>
        </div>
      )}

      {/* Mobile: levels dropdown */}
      <div
        className={`fixed top-0 left-0 bg-background  px-4 rounded-2xl w-full mb-4 flex flex-col justify-center items-center gap-3 h-screen duration-150 ${
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
              variant={problem.id === shownProblem?.id ? "default" : "ghost"}
              onClick={() => {
                setShownProblem(problem);
                setShowLevels(false);
              }}
              className="justify-start text-2xl hover:bg-primary/10 transition"
            >
              {problem.title}
            </Button>
          ))}
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 gap-1 "
      >
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card">
                {/* Main section */}
                <ScrollArea className="h-full " type="always">
                  <div className="h-full rounded-2xl w-full space-y-3">
                    {/* Tabs */}
                    <Tabs
                      defaultValue="problems"
                      className="w-full"
                      value={leftBarActiveTab}
                      onValueChange={setLeftBarActiveTab}
                    >
                      <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                        {/* Problems Tab */}
                        <TabsTrigger
                          value="problems"
                          className=" rounded-none bg-transparent! max-w-fit border-none [&_svg]:opacity-70 [data-state=active]:*:opacity-100"
                        >
                          <FaBookOpen className="text-primary w-4 h-4 " />
                          <span>Problems</span>
                        </TabsTrigger>

                        <Separator
                          orientation="vertical"
                          className="!h-4 bg-foreground/20 "
                        />

                        {/* Standings Tab */}
                        <TabsTrigger
                          value="standings"
                          className="h-full rounded-none bg-transparent! max-w-fit  "
                        >
                          <MdLeaderboard className="text-secondary w-4 h-4 " />
                          <span>Standings</span>
                        </TabsTrigger>

                        <Separator
                          orientation="vertical"
                          className="!h-4 bg-foreground/20 "
                        />

                        {/* Editorials Tab */}
                        <TabsTrigger
                          value="editorials"
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <FaLightbulb className="text-primary w-4 h-4 " />
                          <span>Editorial</span>
                        </TabsTrigger>

                        <Separator
                          orientation="vertical"
                          className="!h-4 bg-foreground/20 "
                        />

                        {/* Support Tab */}
                        <TabsTrigger
                          value="support"
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <MdContactSupport className="text-primary w-4 h-4 " />
                          <span>Support</span>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="problems"
                        className="p-4 flex flex-col gap-3"
                      >
                        {/* Header */}
                        <div className="flex flex-col gap-3">
                          <h2 className="font-bold text-2xl">
                            {ContestInfo.title}
                          </h2>

                          {/* Tags */}
                          <div className="flex gap-1">
                            {/* Difficulty */}
                            <div className="bg-muted px-3 py-1 rounded-lg flex items-center justify-center ">
                              <span className="text-destructive">
                                {ContestInfo.difficulty}
                              </span>
                            </div>

                            {/* Topics */}
                            <div className="bg-muted px-2 py-1 rounded-lg flex items-center gap-1 justify-center ">
                              <BsTag />
                              <span className="">Topics</span>
                            </div>
                          </div>
                        </div>

                        {/* Problems */}
                        <div className="flex flex-col items-center gap-3 w-full   py-2 pr-2 ">
                          {problems.map((problem) => (
                            <div
                              key={`${problem.title}-${problem.id}`}
                              onClick={() => setShownProblem(problem)}
                              className=" group w-full flex justify-between items-center gap-4 rounded-md text-xs p-4 bg-muted cursor-default  "
                            >
                              {/* Left section of problem */}
                              <div className="flex flex-col justify-between gap-2 ">
                                {/* Problem title */}
                                <h3 className="text-lg font-semibold">
                                  Problem {problem.title}
                                </h3>

                                {/* Lower part */}
                                <div className="pl-1 flex items-center gap-3">
                                  {/* Likes & commentss */}
                                  <div className="flex justify-between items-center gap-2">
                                    {/* Like */}
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                      <ThumbsUp className="w-4 h-4" />{" "}
                                      <span className="text-sm font-medium">
                                        {problem.like}
                                      </span>
                                    </div>

                                    {/* comments */}
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                      <MessageSquare className="w-4 h-4" />{" "}
                                      <span className="text-sm font-medium">
                                        {problem.like}
                                      </span>
                                    </div>
                                  </div>

                                  {/* People answered */}
                                  <div className="flex items-center">
                                    {/* TODO: change to people answered */}
                                    <Progress
                                      value={71}
                                      className="bg-background w-24 h-[3px] *:bg-success/50"
                                    />
                                    <div className="flex gap-1 items-center text-xs">
                                      <span>71%</span>
                                      <span className="text-muted-foreground/70">
                                        (1200 submissions)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Submit button */}
                              <Button
                                variant={"secondary"}
                                className="bg-card text-muted-foreground hover:bg-card/70 hover:text-foreground/60"
                              >
                                Try Out
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <ScrollBar className="" />
                </ScrollArea>

                {/* Legal & Copyright section */}
                <section className="flex flex-col justify-center items-center gap-2">
                  <div className="flex items-center  text-xs">
                    <Image
                      src={"/Logo.png"}
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
                      className=" text-primary border-b border-primary"
                    >
                      Terms of use
                    </button>
                    <button
                      title="Im not a Link :>"
                      className=" text-primary border-b border-primary"
                    >
                      Cookie notice
                    </button>
                    <button
                      title="Im not a Link :>"
                      className=" text-primary border-b border-primary"
                    >
                      Privacy policy
                    </button>
                  </div>
                </section>
              </section>
            </ResizablePanel>
            {/* TODO: Fix Handler here (hover only works on 1 px) */}
            <ResizableHandle className="bg-transparent border-2 border-transparent hover:border-sidebar-border" />
          </>
        )}

        {/* Right side (split vertically) */}
        <ResizablePanel defaultSize={isMobile ? 100 : 70}>
          <ResizablePanelGroup
            direction="vertical"
            className="flex flex-col gap-1"
          >
            <ResizablePanel defaultSize={70}>
              <section className="w-full h-full rounded-sm bg-card">
                <Tabs
                  defaultValue="problemStatement"
                  className="w-full h-full"
                  value={rightBarActiveTab}
                  onValueChange={setRightBarActiveTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {/* Problems Tab */}
                    <TabsTrigger
                      value="problemStatement"
                      className=" rounded-none bg-transparent! max-w-fit border-none [&_svg]:opacity-70 [data-state=active]:*:opacity-100"
                    >
                      <FaBookOpen className="text-primary w-4 h-4 " />
                      <span>Problems</span>
                    </TabsTrigger>

                    <Separator
                      orientation="vertical"
                      className="!h-4 bg-foreground/20 "
                    />

                    {/* Standings Tab */}
                    <TabsTrigger
                      value="standings"
                      className="h-full rounded-none bg-transparent! max-w-fit  "
                    >
                      <MdLeaderboard className="text-secondary w-4 h-4 " />
                      <span>Standings</span>
                    </TabsTrigger>

                    <Separator
                      orientation="vertical"
                      className="!h-4 bg-foreground/20 "
                    />

                    {/* Editorials Tab */}
                    <TabsTrigger
                      value="editorials"
                      className="h-full rounded-none bg-transparent! max-w-fit"
                    >
                      <FaLightbulb className="text-primary w-4 h-4 " />
                      <span>Editorial</span>
                    </TabsTrigger>

                    <Separator
                      orientation="vertical"
                      className="!h-4 bg-foreground/20 "
                    />

                    {/* Support Tab */}
                    <TabsTrigger
                      value="support"
                      className="h-full rounded-none bg-transparent! max-w-fit"
                    >
                      <MdContactSupport className="text-primary w-4 h-4 " />
                      <span>Support</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="problemStatement"
                    className="w-150 h-full mx-auto p-4 flex-col gap-4 flex items-center"
                  >
                    {/* Problem Header */}
                    <div>
                      <h1 className="text-2xl font-bold">
                        Problem {shownProblem?.title ?? "the fuck"}
                      </h1>
                    </div>
                    <Separator className="bg-bg-light h-0.5!" />

                    {/* Problem Description & Submission */}
                    <div className="flex flex-col gap-5">
                      {/* Problem Description */}
                      <div>
                        <p className="">{shownProblem?.description}</p>
                      </div>

                      {/* Problem Submission */}
                      <div className="w-full max-w-2xl flex gap-4">
                        <Input
                          className="border-none bg-bg-light! text-text-muted"
                          placeholder="Answer here..."
                        />
                        <Button className="w-25 text-text" variant="primary">
                          Submit
                        </Button>
                      </div>
                    </div>
                    <Separator className="bg-bg-light h-0.5!" />

                    {/* Help */}
                    <div className="w-full flex flex-col items-start gap-4 ">
                      {/* Show calculator */}
                      <button className="text-primary underline">
                        Show calculator
                      </button>
                      {/* How to submit */}
                      <Collapsible className="flex flex-col gap-1">
                        <CollapsibleTrigger className="" asChild>
                          <button className="flex items-center gap-1">
                            <span className="font-normal">
                              How do I submit an answer?
                            </span>
                            <span className="underline text-primary">
                              show here
                            </span>
                            <ChevronsUpDown className="w-5 h-5 text-primary" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul
                            role="list"
                            className="list-disc text-text-muted pl-4"
                          >
                            <li>Click on the problem you want to solve.</li>
                            <li>Read the problem statement carefully.</li>
                            <li>
                              Submit your solution using the input box provided.
                            </li>
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <Separator className="bg-bg-light h-0.5!" />

                    {/* Report a problem */}
                    <div className="w-full flex justify-end">
                      <button
                        className="text-text-muted underline text-sm"
                      >
                        Report a problem
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </ResizablePanel>
            {/* TODO: Fix Handler here (hover only works on 1 px) */}
            <ResizableHandle className="bg-transparent border-2 border-transparent hover:border-sidebar-border" />
            <ResizablePanel defaultSize={30}>
              <section className="relative w-full h-full space-y-5 rounded-2xl bg-card p-5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full p-4 bg-accent flex items-center gap-2 text-sm">
                  <BookOpen className="text-primary" />
                  Submissions
                </div>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
