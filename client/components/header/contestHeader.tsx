import * as React from "react";
import Logo from "../ui/logo";
import { Button } from "../ui/button";
import { ThemeButton } from "../Theme-button";
import LogoIcon from "../ui/logo-mini";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight, Logs } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  return (
    <div className="h-10 bg-transparent mb-2 w-full bg-card flex justify-between items-center gap-5 px-4">
      {/* Left section */}
      <div className="">
        <div className="flex items-end gap-5 ">
          <div className="flex items-end gap-3">
            <LogoIcon />
            <Separator
              orientation="vertical"
              className="!h-4 bg-foreground/20 "
            />
          </div>
          <div className="flex items-end gap-2">
            <TfiMenu className="w-4.5 h-4.5 text-muted-foreground" />
            <h6 className="text-base font-normal self-end leading-none">
              Contest List
            </h6>
            <div className="flex gap-3">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <Button> Submit! </Button>

      {/* Right nav */}
      <div className="flex items-center gap-2 text-xs">
        <ThemeButton />
        <div className="flex justify-center items-center text-xl font-semibold h-10 w-10 rounded-full overflow-hidden bg-primary text-white">
          A
        </div>
      </div>
    </div>
  );
};

export default Header;
