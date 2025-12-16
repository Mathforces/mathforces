import Right_Side from "@/components/Contest/Right_Side";
import Suggested_problem from "@/components/Contest/Suggested_problem";

export default function Page() {
  return (
    <main className="pt-24 flex flex-col md:flex-row items-center lg:justify-evenly gap-5 lg:gap-10 md:items-start overflow-hidden">
      <Suggested_problem />

      <Right_Side />
    </main>
  );
}
