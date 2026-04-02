"use client";
import { useEffect, useState } from "react";
import { UserRanking } from "@/types/types";
import RankingCards from "./RankingCards";

function RegionalRankingCards() {
  const [usersRankings, setUsersRankings] = useState<UserRanking[]>([]);
  useEffect(() => {
    const tempUserRankings: UserRanking[] = [
      {
        id: "i3k3j3n",
        username: "piKiller333",
        ranking_num: 1,
        title_short: "LGM",
        rating: 1300,
        contests_entered_count: 123,
      },
      {
        id: "i3k3j3n",
        username: "piKiller333",
        ranking_num: 2,
        title_short: "GM",
        rating: 1300,
        contests_entered_count: 123,
      },
      {
        id: "i3k3j3n",
        username: "piKiller333",
        ranking_num: 3,
        title_short: "Ppl",
        rating: 1300,
        contests_entered_count: 123,
      },
    ];
    setUsersRankings(tempUserRankings);
  }, []);
  return (
    <div className="space-y-2">
      {usersRankings.map((userRanking) => (
        <div>
          <RankingCards userRankingData={userRanking} />
        </div>
      ))}
    </div>
  );
}

export default RegionalRankingCards;
