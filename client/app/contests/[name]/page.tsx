"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";

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
    <main>
      {/* Progress Section */}
      <div className="mb-5 mx-auto w-fit p-4 rounded-2xl border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-5">
        <p>Maths isn’t mathing due to your brilliance! {progress}%</p>
        <Slider
          max={100}
          step={1}
          value={[progress]}
          onValueChange={handleChange}
          className="w-52 -z-10"
          disabled
        />
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue="problems"
        className="w-full flex flex-col items-center"
      >
        <TabsList className="mb-5 grid grid-cols-2 md:grid-cols-4 gap-2 border border-primary/20 p-2 rounded-2xl w-fit h-fit">
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="standing">Standing</TabsTrigger>
          <TabsTrigger value="editorial">Editorial</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Problems Tab */}
        <TabsContent
          value="problems"
          className="flex justify-center items-start gap-5 w-full"
        >
          {/* LEFT SIDE (hidden on mobile unless toggled) */}
          {!isMobile && (
            <aside className="w-2/5 space-y-5">
              <div className="border border-primary/20 p-4 rounded-2xl flex-1 max-w-3xl">
                <h4 className="mb-2 font-semibold">
                  Problems will be listed here
                </h4>
                <p className="text-gray-700">
                  Select a level from the left to view its problems.
                </p>
              </div>
              <div className="border border-primary/20 p-4 rounded-2xl w-full flex flex-col gap-3">
                <h4 className="font-semibold text-center mb-2 flex justify-center items-center gap-2">
                  <Gauge size={25} strokeWidth={3} className="text-primary" />{" "}
                  Levels
                </h4>
                <div className="flex flex-wrap">
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
                      onClick={() => setLevel(item)}
                      className="justify-start text-lg hover:bg-primary/10 transition"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Mobile: Button to toggle Levels */}
          {isMobile && (
            <div className="fixed top-20 left-4 w-fit flex justify-center mb-3">
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
              <Gauge size={25} strokeWidth={3} className="text-primary" />{" "}
              Levels
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

          {/* RIGHT SIDE */}
          <section className="border border-primary/20 p-4 rounded-2xl max-w-2xl w-full">
            <p>
              Problem :{" "}
              <span className="text-primary font-bold"> {level} </span>
            </p>
            <h5 className="mb-2">{ContestInfo.description}</h5>
            <div className="flex items-end gap-2">
              <Textarea
                className="mt-4 max-h-40 resize-y"
                placeholder="Answer here..."
              />
              <Button className="mt-4" variant="primary">
                Submit
              </Button>
            </div>
          </section>
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
            <p>Solution explanations will be posted here after the contest.</p>
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
    </main>
  );
}
