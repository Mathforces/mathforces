'use client'
import { useUser } from "@/app/hooks/useUser";
import { TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

interface ContestSubmissionsProps {
}

const ContestSubmissions: React.FunctionComponent<ContestSubmissionsProps> = (
  props,
) => {
  const {user} = useUser();
  const contestParams = useSearchParams();
  const problemId = contestParams.get("problemId") || null;
  const [submissions, setSubmissions] = useState();
  useEffect(() => {
    if(user && problemId){
      axios.get(`/api/problems/${problemId}/submissions/${user.id}`)
      .then((res) => {
        if(res){
            setSubmissions(res.data)
            console.log("submisssions: ", res.data)
        }
      })
      .catch((err) => {
          console.log("couldn't get this problems' submission")
        console.error(err);
      })
    }
  }, [problemId, user])
  return (
    <TabsContent value="submissions" className="w-full h-full p-2">
      
    </TabsContent>
  );
};

export default ContestSubmissions;
