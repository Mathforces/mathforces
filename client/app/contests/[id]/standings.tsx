"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProfile } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeNumber } from "@/lib/utils";
import { contestProblemDefaultValues, Standing } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
type Props = {
  contestId: string;
};

const ContestStandings = ({ contestId }: Props) => {
  const userProfile = useProfile((state) => state.user);
  const [standings, setStandings] = useState<Standing[]>([]);
  const getStandings = async () => {
    axios
      .get(`/api/contests/${contestId}/standings`)
      .then((res) => {
        if (res) {
          const standingsTemp = res.data;
          console.log("contest_standings: ", standingsTemp);
          setStandings(standingsTemp);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getStandings();
  }, []);

  return (
    <div>
      <TabsContent value="standings" className="p-4 flex flex-col gap-3 w-full">
        {standings.map((standing, index) => (
          <div
            key={standing.id ?? index}
            className="flex items-center justify-between"
          >
            <div>
              {/* user's icon */}
              <span>{standing?.profiles?.username ?? "UNKOWN USER"}</span>
            </div>
            <div>
              <span>{safeNumber(standing.score)}</span>
            </div>

            <div>
              <span>{safeNumber(standing.penalty)}</span>
            </div>
          </div>
        ))}
      </TabsContent>
    </div>
  );
};

export default ContestStandings;
