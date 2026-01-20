"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contest, contestProblem, FullProblem } from "@/types/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Separator } from "@radix-ui/react-separator";
import { TabsContent } from "@radix-ui/react-tabs";
import { ChevronsUpDown } from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";
import Problem_Card from "./Problem_Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { MathJaxContent } from "@/components/ui/MathJaxContent";

interface Props {
  shownProblemId: number | null;
}

const Problem_Statement_card = ({ shownProblemId: shownProblem }: Props) => {
  const [fullProblem, setFullProblem] = useState<FullProblem | null>(null);

  useEffect(() => {
    if (shownProblem) {
      const getDescription = async () => {
        await axios
          .get(`/api/problems/${shownProblem}`)
          .then((res) => {
            setFullProblem(res.data);
          })
          .catch(() => {
            console.error("Error fetching full problem");
          });
      };
      getDescription();
    }
  }, [shownProblem]);
  return (
    <TabsContent
      value="problemStatement"
      className="w-150 h-full mx-auto p-4 my-2 flex-col gap-4 flex items-center"
    >
      {/* Problem Header */}
      <div className="flex flex-col gap-2 mb-2 w-full">
        <h1 className="text-2xl font-bold text-center">
          Problem {fullProblem?.name ?? "UNKNOWN"}
        </h1>

        {/* Methods to access problem */}
        <div className="flex items-center gap-40 mx-auto text-primary">
          {/* PDF access */}
          <button className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <FaRegFilePdf />
              <span>PDF</span>
            </div>
            <FaExternalLinkAlt className="w-3 h-3" />
          </button>

          {/* Latex access */}
          <button className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <LuFileText />
              <span>Latex</span>
            </div>
            <FaExternalLinkAlt className="w-3 h-3" />
          </button>
        </div>
      </div>
      <Separator className="bg-bg-light h-0.5! w-full" />

      {/* Problem Description & Submission */}
      <MathJaxContent className="flex flex-col gap-5 w-full">
        {/* Problem Description */}
        <div className="">
          <p className="text-text text-sm">{fullProblem?.description}</p>
        </div>
      </MathJaxContent>
        {/* Problem Submission */}
        <div className="w-full max-w-2xl flex gap-4">
          <Input
            className="flex-1 border-none bg-bg-light! text-text-muted"
            placeholder="Answer here..."
          />
          <Button className="w-25 text-text" variant="primary">
            Submit
          </Button>
        </div>
      <Separator className="bg-bg-light h-0.5! w-full" />

      {/* Help */}
      <div className="w-full flex flex-col items-start gap-4 ">
        {/* Show calculator */}
        <button className="text-primary underline">Show calculator</button>
        {/* How to submit */}
        <Collapsible className="flex flex-col gap-1">
          <CollapsibleTrigger className="" asChild>
            <button className="flex items-center gap-1">
              <span className="font-normal">How do I submit an answer?</span>
              <span className="underline text-primary">show here</span>
              <ChevronsUpDown className="w-5 h-5 text-primary" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul role="list" className="list-disc text-text-muted pl-4">
              <li>Click on the problem you want to solve.</li>
              <li>Read the problem statement carefully.</li>
              <li>Submit your solution using the input box provided.</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Separator className="bg-bg-light h-0.5! w-full" />

      {/* Report a problem */}
      <div className="w-full flex justify-end">
        <button className="text-text-muted underline text-sm">
          Report a problem
        </button>
      </div>
    </TabsContent>
  );
};

export default Problem_Statement_card;
