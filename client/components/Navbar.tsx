"use client";
import { MainLinks } from "@/data/Links";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Logs, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeButton } from "./Theme-button";
import { profile } from "console";
import { useProfile } from "@/app/store";

const Navbar = () => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const userProfile = useProfile((state) => state.userProfile);
  const bannedURLs = ["/contests/"];
  const router = useRouter();
  let isBanned = false;
  bannedURLs.forEach((e) => {
    if (pathName.includes(e)) {
      isBanned = true;
    }
  });
  useEffect(() => {
    console.log("userprofile: ", userProfile)
  }, [userProfile])
  if (isBanned || !userProfile) {
    return;
  }
  return (
    <nav className="fixed top-0 left-2/4 -translate-x-2/4 w-full max-w-7xl flex justify-between md:justify-evenly items-center gap-5 p-5 z-50 bg-card rounded-b-2xl">
      <Link href="/">
        <h5 className="font-bold! flex items-end justify-end z-50">
          <div className="flex justify-end items-end">
            <h4 className="font-bold!">N</h4>UM
          </div>

          <div className="flex items-start gap-px">
            <div className="flex flex-col justify-center items-center gap-0.5">
              <Plus strokeWidth={6} size={10} className="text-primary" />
              <div className="w-1  h-2.5 bg-foreground" />
            </div>
            TZ
          </div>
        </h5>
      </Link>
      <div className="hidden md:flex">
        {MainLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`mx-3 text-lg hover:text-primary duration-100 ${
              pathName === link.href
                ? "text-primary "
                : "text-neutral-700 dark:text-neutral-300 "
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-cenuter gap-2">
        <ThemeButton />
        {userProfile ? (
          <div>hello {userProfile.username}</div>
        ) : (
          <Button variant={"primary"} link="/sign_up">
            Sign Up
          </Button>
        )}
        <Button
          variant={"outline"}
          onClick={() => setOpenMenu(!openMenu)}
          className="text-primary hover:text-primary/80 md:hidden"
        >
          <Logs size={35} strokeWidth={3} />
        </Button>
      </div>

      <div
        className={`absolute top-20 left-0 w-full bg-white/10 backdrop-blur-xs flex flex-col items-center md:hidden py-5
    transition-all duration-300 ease-out 
    ${
      openMenu
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-5 pointer-events-none"
    }
  `}
      >
        {MainLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setOpenMenu(false)}
            className={`my-2 w-full text-center text-lg hover:text-primary duration-100 ${
              pathName === link.href
                ? "text-primary"
                : "text-gray-700 dark:text-neutral-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
