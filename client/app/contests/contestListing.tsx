import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/lib/utils";
import { Contest } from "@/types/types";
import Image from "next/image";
import { formatDistance } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useProfile } from "../store";
import No_solved_and_call_to_action from "@/components/contests/no_solved_and_call_to_action";

type Props = {
  contest: Contest;
};

function ContestListing({ contest }: Props) {
  return (
    <div className="flex items-center gap-3">
      {/* Contest thumbnail */}
      <div className="w-fit">
        {/* TODO: Add actual thumbnails or more options */}
        <Image
          src={`/contest_thumbnail_${["yellow", "blue"][Math.round(Math.random())]}.png`}
          alt="contest thumbnail"
          width={100}
          height={100}
        />
      </div>

      {/* Contest description */}
      <div className="flex items-center justify-between flex-1">
        {/* Title & Date */}
        <div>
          <h4 className="text-lg !font-normal ">{contest.name}</h4>
          <span className="text-muted-foreground text-sm">
            {getFormattedDate(contest.start_date).fullDate} (
            {formatDistance(contest.start_date, new Date(), {
              addSuffix: true,
            })}
            )
          </span>
        </div>

        {/* No. problems solved & Call to action */}
        <No_solved_and_call_to_action contest={contest} />
      </div>
    </div>
  );
}

export default ContestListing;
