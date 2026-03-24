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
import { useState } from "react";
import ContestListing from "@/app/contests/contestListing";

interface Props {
  contests: Contest[];
}
const SuggestedContest = ({ contests }: Props) => {
  const userId = useProfile((state) => state.user?.id);
  const [contestTypeTab, setContestTypeTab] = useState("my_contests");
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

  // Handle error
  if (!contests || contests.length === 0) {
    return (
      <section className="flex flex-col justify-center items-center h-screen gap-4 px-3 text-center">
        <div className="text-[150px] md:text-[200px] font-bold text-primary/20">
          404
        </div>
        <h1 className="mb-2">Contest Not Found</h1>

        <div className="mt-5 flex justify-center items-center gap-4">
          <Link href={"/"}>
            <Button variant="primary">Home</Button>
          </Link>
          <Link href={"/contests"}>
            <Button variant="outline">Contests</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full md:w-3/4 max-w-xl flex flex-col gap-5 my-5">
      <Tabs
        defaultValue="my_contests"
        value={contestTypeTab}
        onValueChange={setContestTypeTab}
      >
        <Card className="pt-3 border-none">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="my_contests">My Contests</TabsTrigger>
              <TabsTrigger value="past_contests">Past Contests</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="my_contests">
              <div className="space-y-3">
                {/* TODO: Change this to my contests  */}
                {contests.map((contest, i) => (
                  <ContestListing key={contest?.id ?? i} contest={contest} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="past_contests"></TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      <h4 className=" flex items-center gap-2">
        <Radical size={30} strokeWidth={3} className="text-primary" />
        Suggested Contests
      </h4>
      <div className="flex flex-col gap-5">
        {contests.map((contest, i) => (
          <Link
            key={contest.name + i}
            href={`/contests/${contest.id}`}
            className="p-6 rounded-2xl bg-card hover:-translate-y-0.5 duration-100 cursor-pointer flex justify-between"
          >
            <div>
              <h4 className="text-primary text-xl font-semibold mb-2">
                {contest.name}
              </h4>
              <p>{contest.description}</p>
            </div>
            <Button onClick={() => handleRegister(contest.id)}>Register</Button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SuggestedContest;
