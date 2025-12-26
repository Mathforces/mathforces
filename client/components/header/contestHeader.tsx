import * as React from "react";
import Logo from "../ui/logo";
import { Button } from "../ui/button";
import { ThemeButton } from "../Theme-button";
import LogoIcon from "../ui/logo-mini";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { RiFireFill } from "react-icons/ri";
import UserIcon from "./userIcon";
interface IHeaderProps {}

const ContestHeader: React.FunctionComponent<IHeaderProps> = (props) => {
  return (
    <div className="h-10 bg-transparent mb-2 w-full bg-card flex justify-between items-center gap-5 px-4 my-1">
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

      {/* Middle section */}
      <div className="flex gap-1">
        {/* Take notes */}
        <div className="w-8 h-8 bg-card rounded-md flex items-center justify-center p-2">
          <FaRegNoteSticky className="text-muted-foreground" />
        </div>

        {/* Take notes */}
        <div className="w-26 h-8 bg-card rounded-l-md flex items-center gap-2 p-2">
          <FaHourglassHalf className="text-primary" />
          <p className="text-foreground/80">1:30:23</p>
        </div>

        {/* Take notes */}
        <button className="w-25 h-8 bg-card rounded-r-md flex items-center justify-center gap-2 p-2">
          <IoCloudUploadOutline className="text-success" />
          <p className="text-base text-success font-mono">Submit</p>
        </button>

        {/* Take notes */}
        <div className="w-8 h-8 bg-card rounded-md flex items-center justify-center p-2">
          <FiHelpCircle className="text-muted-foreground" />
        </div>
      </div>

      {/* Right nav */}
      <div className="flex items-center gap-2 text-xs">
        <LuLayoutDashboard className="w-5 h-5 text-muted-foreground" />
        <CiSettings className="w-5 h-5 text-muted-foreground" />
        <RiFireFill className="w-5 h-5 text-muted-foreground" />
        <UserIcon />
        {/* <ThemeButton />
        <div className="flex justify-center items-center text-xl font-semibold h-10 w-10 rounded-full overflow-hidden bg-primary text-white">
          A
        </div> */}
      </div>
    </div>
  );
};

export default ContestHeader;
