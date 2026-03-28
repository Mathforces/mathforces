import { Separator } from "@/components/ui/separator";
import { IoSearch } from "react-icons/io5";
import { ProblemSetTable } from "./data_table";
import { columns } from "./columns";
import { HEADER_MARGIN } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import ProblemSetsLeftBarBottomSection from "./leftBarBottomSection";
import ProblemSetLeftBarTopSection from "./leftBarTopSection";
import RsvpButton from "@/components/rsvpButton";
import { Suspense } from "react";

export default function LearningDashboard() {
  const trendingCompetitions = [
    { name: "Sat", participants: "123" },
    { name: "Kangaroo", participants: "345" },
    { name: "Shabola", participants: "341" },
  ];

  return (
    <main
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className="max-w-full flex px-0 grid grid-cols-24 bg-background"
    >
      {/* Left side bar */}
      <aside className="bg-background hidden xl:block col-span-4 max-w-60 border-r border-foreground/20 px-2 py-2">
        <ProblemSetLeftBarTopSection />
        <div className=" flex overflow-hidden my-4 mx-4">
          <Separator className="bg-foreground/20" />
        </div>

        <ProblemSetsLeftBarBottomSection />
      </aside>

      {/* Main section */}
      <section className="px-6 py-6 col-span-16 w-full max-w-270 mx-auto">
        {/* Suggested problemsets (ads) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-linear-to-br from-gray-100 to-gray-200 text-black rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Challenge™</h3>
              <p className="text-[14px] mt-2 text-black/60">
                Turn calculus into gamified progress
              </p>
            </div>
            <RsvpButton name="Calculus Challenge" />
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Linear Algebra</h3>
              <p className="text-[14px] mt-2">30 Days Challenge</p>
            </div>
            <RsvpButton name="30 Days Challenge " />
          </div>
          <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Top SAT Questions</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  DAY 30
                </div>
              </div>
            </div>
            <RsvpButton name="SAT Challenge" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Suspense fallback={<div>Loading...</div>}>
            <ProblemSetTable columns={columns} />
          </Suspense>
        </div>

        <div className=" flex overflow-hidden">
          <Separator orientation="vertical" className="bg-foreground/20" />
        </div>
      </section>

      {/* Right side bar */}
      <aside className="bg-background  py-5 hidden xl:block col-span-4 mr-2 space-y-5">
        <Card className="gap-0 border-none rounded-md">
          <CardHeader className="font-medium flex line-clamp-2">
            Day 13{" "}
            <span className="font-normal text-xs text-muted-foreground">
              (since Sat Feb 7th 2026)
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="">
              <Calendar className="w-full bg-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2 border-none rounded-md">
          <CardHeader>Trending Competitions</CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

              <Input
                type="text"
                placeholder="Search for competitions..."
                className="w-full bg-bg-light text-sm py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              {trendingCompetitions.map((comp) => (
                <div key={comp.name} className="bg-bg-light px-2 gap-2 py-1 flex items-center justify-between w-fit rounded-md text-text/80">
                  <span className="text-sm">{comp.name}</span>
                  <div className="px-2 bg-primary rounded-md text-xs">
                    <span>{comp.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
