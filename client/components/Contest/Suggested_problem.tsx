import { Contest } from "@/types/types";
import { Radical } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  Contest: Contest[];
}
const Suggested_problem = ({ Contest }: Props) => {
  if (!Contest || Contest.length === 0) {
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
      <h4 className=" flex items-center gap-2">
        <Radical size={30} strokeWidth={3} className="text-primary" />
        Suggested problem sets
      </h4>
      <div className="flex flex-col gap-5">
        {Contest.map((item, i) => (
          <Link
            key={item.name + i}
            href={`/contests/${item.id}`}
            className="p-6 rounded-2xl bg-card hover:-translate-y-0.5 duration-100 cursor-pointer"
          >
            <h4 className="text-primary text-xl font-semibold mb-2">
              {item.name}
            </h4>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Suggested_problem;
