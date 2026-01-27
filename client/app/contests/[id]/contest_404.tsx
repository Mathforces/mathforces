import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

interface IContestNotFoundProps {}

const ContestNotFound: React.FunctionComponent<IContestNotFoundProps> = (
  props,
) => {
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
};

export default ContestNotFound;
