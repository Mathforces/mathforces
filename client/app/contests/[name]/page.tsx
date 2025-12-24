"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Gauge, MessageSquare, Plus, ThumbsUp } from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import { ThemeButton } from "@/components/Theme-button";
import Logo from "@/components/ui/logo";
import Header from "@/components/header/contestHeader";

const Content = [
  {
    title: "Beginner Problems",
    link: "/contests/beginner-problems",
    description:
      "A collection of problems suitable for beginners to get started with competitive programming.",
  },
  {
    title: "Math Contest",
    link: "/contests/math-contest",
    description:
      "Sharpen your problem-solving skills with fun and challenging math problems.",
  },
  {
    title: "Logic Challenge",
    link: "/contests/logic-challenge",
    description:
      "Test your logic and reasoning with these carefully designed problems.",
  },
];

export default function Page() {
  const params = useParams();
  const isMobile = useIsMobile();

  const [showLevels, setShowLevels] = useState(false);
  const [progress, setProgress] = useState<number>(45);
  const [level, setLevel] = useState<string>("A1");
  const ContestInfo = Content.find(
    (item) => item.link === `/contests/${params.name}`
  );

  useEffect(() => {
    if (showLevels) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLevels]);

  const handleChange = (value: number[]) => setProgress(value[0]);

  if (!ContestInfo) {
    return (
      <main className="relative min-h-fit flex flex-col items-center justify-start text-center">
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
    <main className="h-screen! max-h-screen! max-w-full!">
      {/* Progress Section */}
      <Header />

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
          {[
            "A1",
            "A2",
            "A3",
            "A4",
            "A5",
            "A6",
            "B1",
            "B2",
            "B3",
            "B4",
            "B5",
            "B6",
          ].map((item) => (
            <Button
              key={item}
              variant={item === level ? "default" : "ghost"}
              onClick={() => {
                setLevel(item);
                setShowLevels(false);
              }}
              className="justify-start text-2xl hover:bg-primary/10 transition"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="h-10/12! flex gap-2"
      >
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={30} maxSize={35}>
              <section className="w-full h-full space-y-5 rounded-2xl  bg-card">
                <section className="h-9/12 p-4 rounded-2xl w-full flex flex-col ">
                  <h6 className="font-semibold text-center mb-2 flex items-center gap-2">
                    <Gauge size={25} strokeWidth={3} className="text-primary" />{" "}
                    {ContestInfo.title} Levels
                  </h6>
                  <div className="flex flex-col items-center gap-2 w-full overflow-y-scroll h-full py-2 pr-2 ">
                    {[
                      "A1",
                      "A2",
                      "A3",
                      "A4",
                      "A5",
                      "A6",
                      "B1",
                      "B2",
                      "B3",
                      "B4",
                      "B5",
                      "B6",
                    ].map((item) => (
                      <div
                        key={item}
                        onClick={() => setLevel(item)}
                        className="group w-full flex justify-between items-center gap-4 rounded-2xl text-xs border border-primary/30 hover:bg-primary transition duration-200 p-3 cursor-default"
                      >
                        <div className="flex flex-col justify-between gap-2 ">
                          <div>
                            Problem{" "}
                            <span className="mark group-hover:text-white! duration-150">
                              {item}
                            </span>
                          </div>
                          <div className="pl-2 flex justify-between items-center gap-5">
                            <div className="flex items-start justify-center gap-0.5 text-[10px]">
                              <ThumbsUp
                                size={10}
                                className="text-primary group-hover:text-white duration-150"
                              />{" "}
                              166
                            </div>
                            <div className="flex items-start justify-center gap-0.5 text-[10px]">
                              <MessageSquare
                                size={10}
                                className="text-primary group-hover:text-white duration-150"
                              />{" "}
                              166
                            </div>
                          </div>
                        </div>
                        <Button variant={"outline"} className="text-[10px]">
                          Try Out
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
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
            <ResizableHandle />
          </>
        )}

        {/* Right side (split vertically) */}
        <ResizablePanel defaultSize={isMobile ? 100 : 70}>
          <ResizablePanelGroup
            direction="vertical"
            className="flex flex-col gap-2"
          >
            <ResizablePanel defaultSize={70}>
              <section className="relative w-full h-full flex flex-col justify-center items-center text-center gap-5 bg-card p-4 rounded-2xl overflow-hidden">
                <Tabs
                  defaultValue="problems"
                  className="w-full flex flex-col items-center"
                >
                  <TabsList className="absolute top-0 left-0 flex justify-start items-start  p-2 w-full bg-card">
                    <TabsTrigger value="problems" className="py-3">
                      Problems
                    </TabsTrigger>
                    <TabsTrigger value="standing" className="py-3">
                      Standing
                    </TabsTrigger>
                    <TabsTrigger value="editorial" className="py-3">
                      Editorial
                    </TabsTrigger>
                    <TabsTrigger value="support" className="py-3">
                      Support
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="problems">
                    <p>
                      Problem :{" "}
                      <span className="text-primary font-bold"> {level} </span>
                    </p>
                    <h5 className="mb-2">{ContestInfo.description}</h5>
                    <div className="w-full max-w-2xl flex items-end gap-2">
                      <Textarea
                        className="mt-4 h-32 max-h-40 resize-y"
                        placeholder="Answer here..."
                      />
                      <Button className="mt-4" variant="primary">
                        Submit
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Standing */}
                  <TabsContent value="standing">
                    <div className="border border-primary/20 p-4 rounded-2xl text-center max-w-3xl mx-auto">
                      <h4 className="font-semibold mb-2">Standing</h4>
                      <p>Leaderboard and results will appear here soon.</p>
                    </div>
                  </TabsContent>

                  {/* Editorial */}
                  <TabsContent value="editorial">
                    <div className="border border-primary/20 p-4 rounded-2xl text-center max-w-3xl mx-auto">
                      <h4 className="font-semibold mb-2">Editorial</h4>
                      <p>
                        Solution explanations will be posted here after the
                        contest.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Support */}
                  <TabsContent value="support">
                    <div className="border border-primary/20 p-4 rounded-2xl text-center max-w-3xl mx-auto">
                      <h4 className="font-semibold mb-2">Support</h4>
                      <p>Need help? Contact the contest organizers here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </ResizablePanel>
            <ResizableHandle />
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
