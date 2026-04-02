import RegionalRankingCards from "@/components/contests/regional_ranking_card";
import RegionalRankingToggle from "@/components/contests/regionalRankingToggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {};

function RegionalRanking({}: Props) {
  return (
    <div className="space-y-4">
      <RegionalRankingToggle />
      <RegionalRankingCards />
    </div>
  );
}

export default RegionalRanking;
