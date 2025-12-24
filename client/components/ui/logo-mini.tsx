import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface ILogoIconProps {}

const LogoIcon: React.FunctionComponent<ILogoIconProps> = (props) => {
  return (
    <Link href={"/"} className="flex items-center gap-2 ">
      <img src="/logo_mini.svg" alt="" className="w-6 h-6" />
      {/* <div className="flex flex-col justify-center items-center gap-0.5">
        <Plus strokeWidth={6} size={10} className="text-primary" />
        <div className="w-1 h-4 bg-foreground" />
      </div> */}
    </Link>
  );
};

export default LogoIcon;
