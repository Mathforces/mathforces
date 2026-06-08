import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import ContestListing from "./contestListing";
import { Contest } from "@/types/types";

type Props = { contest: Contest };

function MobileContentListing({ contest }: Props) {
  return (
    <Popover>
      <PopoverTrigger className="w-full justify-start">
        <ContestListing contest={contest} />
      </PopoverTrigger>
      <PopoverContent className="absolute left-0 ">
        <div></div>
      </PopoverContent>
    </Popover>
  );
}

export default MobileContentListing;
