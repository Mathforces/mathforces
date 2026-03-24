import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/lib/utils";
import { Contest } from "@/types/types";
import Image from "next/image";
import { formatDistance } from "date-fns";

type Props = {
  contest: Contest;
};

function ContestListing({ contest }: Props) {
  return (
    <div className="flex items-center gap-3">
      {/* Contest thumbnail */}
      <div className="w-fit">
        <Image
          src={"/contest_thumbnail.png"}
          alt="contest thumbnail"
          width={90}
          height={90}
        />
      </div>

      {/* Contest description */}
      <div className="flex items-center justify-between flex-1">
        {/* Title & Date */}
        <div>
          <h4 className="text-base !font-normal ">{contest.name}</h4>
          <span className="text-muted-foreground text-sm">
            {getFormattedDate(contest.start_date).fullDate} (
            {formatDistance(contest.start_date, contest.end_date, {
              addSuffix: true,
            })}
            )
          </span>
        </div>

        {/* No. problems solved & Call to action */}
        <div className="flex items-center gap-2">
          <div className="bg-bg-light rounded-md px-2 flex items-center">
            {/* TODO: Add the actual number of problems solved */}
            <span className="text-sm text-muted-foreground tracking-wider">
              {0}/{contest.problem_count}
            </span>
          </div>
          <Button className="bg-primary/25 border border-primary/75">
            Practice
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContestListing;
