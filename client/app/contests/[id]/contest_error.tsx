import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface IContestErrorProps {
  error: string;
}

const ContestError: React.FunctionComponent<IContestErrorProps> = ({
  error,
}) => {
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
};

export default ContestError;
