import { Contest } from "@/types/types";
import { Radical } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import axios from "axios";
import { useProfile } from "@/app/store";
import { toast } from "sonner";

interface Props {
  contests: Contest[];
}
const SuggestedContest = ({ contests }: Props) => {
  const userId = useProfile((state) => state.user?.id)
  const handleRegister = async (contestId: string) => {
    axios.post(`/api/contests/${contestId}/registered`, { user_id: userId })
      .then((res) => {
        if (res) {
          toast.success("Registered Successfully!")
        }
      })
      .catch((error) => {
        console.error(error);
        if(error.response.data.error.includes("duplicate key value violates unique constraint")){
          console.log("You are already registered to this contest")
          toast.error("You are already registered to this contest")
        }
        else{
          toast.error("Error Occured while registering to contest")
        }
      })
  }


  if (!contests || contests.length === 0) {
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
        Suggested Contests
      </h4>
      <div className="flex flex-col gap-5">
        {contests.map((contest, i) => (
          <Link
            key={contest.name + i}
            href={`/contests/${contest.id}`}
            className="p-6 rounded-2xl bg-card hover:-translate-y-0.5 duration-100 cursor-pointer flex justify-between"
          >
            <div>
              <h4 className="text-primary text-xl font-semibold mb-2">
                {contest.name}
              </h4>
              <p>{contest.description}</p>
            </div>
            <Button onClick={() => handleRegister(contest.id)}>Register</Button>
          </Link>


        ))}
      </div>
    </section>
  );
};

export default SuggestedContest;
