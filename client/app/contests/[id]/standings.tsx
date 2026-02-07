'use client'
import { useUser } from "@/app/hooks/useUser";
import { useProfile } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contestProblemDefaultValues, Standing } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
type Props = {
  contestId: string;
}

const ContestStandings = ({ contestId }: Props) => {
  const userProfile = useProfile((state) => state.user);
  const [standings, setStandings] = useState<Standing[]>([]);

  const getStandings = async () => {
    axios.get(`/api/contests/${contestId}/standings`)
      .then((res) => {
        if (res) {
          console.log("contest_standings: ", standings)
          setStandings((standings));
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Run the function on mount
  useEffect(() => {
    getStandings();
  }, [])
  return (
    <div>
      <TabsContent value="standings" className="p-4 flex flex-col gap-3 w-full">
        {
          standings.map((standing) => (
            <div className="flex items-center justify-between">
              <div>
                {/* user's icon */}
                <span>{standing.profiles.name}</span>
              </div>
              <div>
                <span>{standing.score}</span>
              </div>

            </div>
          ))
        }
      </TabsContent>
    </div>
  )
}

export default ContestStandings
