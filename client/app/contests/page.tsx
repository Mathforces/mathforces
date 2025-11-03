import Right_Side from "@/components/Contest/Right_Side";
import Suggested_problem from "@/components/Contest/Suggested_problem";

export default function Page() {
  return (
    <main className="px-5 lg:px-10  max-w-7xl mx-auto flex flex-col md:flex-row items-center lg:justify-evenly gap-5 lg:gap-10 md:items-start overflow-hidden ">
      {/* left side Suggested Problems */}
      <Suggested_problem />

      {/* right side Next Rank */}
      <Right_Side />
    </main>
  );
}
