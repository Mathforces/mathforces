"use client";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { RiLayout2Fill } from "react-icons/ri";
import { TfiMenu } from "react-icons/tfi";
import UserIcon from "../header/userIcon";
import { Separator } from "../ui/separator";
import ContestHeaderTimer from "./contestHeaderTimer";
import { IoIosSettings } from "react-icons/io";
import ComingSoon from "../comingSoon";
import Image from "next/image";
import Link from "next/link";
import { Contest } from "@/types/types";
interface Props {
  contest: Contest;
}
const ContestHeader = ({ contest }: Props) => {
  return (
    <nav className="min-h-10 bg-transparent mb-2 w-full grid grid-cols-[auto_1fr_auto] md:flex md:justify-between items-center gap-2 md:gap-5 px-2 md:px-4 my-1">
      {/* Left section */}
      <section className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-3">
            {/* Logo */}
            <Link href={"/"} className="flex shrink-0 items-center gap-2">
              <Image
                src="/logo_mini_light_transparent.svg"
                alt="Logo"
                width={100}
                height={100}
                className="block w-6 h-6 shrink-0"
              />
            </Link>
            <Separator
              orientation="vertical"
              className="hidden md:block h-4! bg-foreground/20"
            />
          </div>
          <ComingSoon>
            <div className="hidden md:flex items-end gap-2">
              <TfiMenu className="w-4.5 h-4.5 text-muted-foreground" />
              <span className="hidden md:inline text-base font-medium self-end leading-none">
                Contest List
              </span>
            </div>
          </ComingSoon>
        </div>
      </section>

      {/* Middle section */}
      <section className="flex min-w-0 justify-center gap-1">
        {/* Take notes */}
        <ComingSoon>
          <button
            disabled
            className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2"
          >
            <FaRegNoteSticky className="text-muted-foreground" />
          </button>
        </ComingSoon>

        {/* Timer */}
        <ContestHeaderTimer contest={contest} />

        {/* Help */}
        <ComingSoon>
          <div className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2">
            <FiHelpCircle className="text-muted-foreground" />
          </div>
        </ComingSoon>
      </section>

      {/* Right section */}
      <section className="flex min-w-fit items-center justify-end gap-3">
        <ComingSoon>
          <button className="w-5 h-5 hidden md:inline hover:*:text-text cursor-pointer">
            <RiLayout2Fill className="text-muted-foreground h-full w-full" />
          </button>
        </ComingSoon>

        <button className="w-5 h-5 hidden md:inline hover:*:text-text cursor-pointer">
          <IoIosSettings className="text-muted-foreground h-full w-full" />
        </button>

        <div className="hidden md:flex items-center gap-1">
          <Image src="/flame.svg" alt="" width={20} height={20} />
          <span className="text-sm text-muted-foreground">1</span>
          {/* TODO: Replace with actual streak */}
          {/* <RiFireFill className="text-muted-foreground h-full w-full" /> */}
        </div>
        <div className="md:hidden">
          <UserIcon size="sm" />
        </div>
        <div className="hidden md:block">
          <UserIcon />
        </div>
      </section>
    </nav>
  );
};

export default ContestHeader;
