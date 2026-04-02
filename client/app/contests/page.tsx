import Right_Side from "@/components/Contest/Right_Side";
import SuggestedContest from "@/components/Contest/suggestedContest";
import RegionalRanking from "./regionalRanking";

export default function Page() {
  return (
    <main className="flex flex-col md:flex-row items-center lg:justify-evenly gap-5 lg:gap-10 md:items-start overflow-hidden">
      <RegionalRanking />
      <SuggestedContest />

      {/* <Right_Side /> */}
    </main>
  );
}
