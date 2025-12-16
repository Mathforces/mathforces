"use client";
import { MainLinks } from "@/data/Links";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { Logs } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  if (pathName.slice(0, 10) === "/contests/") return;
  return (
    <nav className="fixed top-0 left-2/4 -translate-x-2/4 w-full max-w-6xl flex justify-between md:justify-evenly items-center gap-5 p-5 z-50 bg-white rounded-b-2xl">
      <Link href="/">
        <Image
          src={"/Logo.png"}
          alt="logo"
          width={100}
          height={100}
          className="object-contain h-10 px-2 rounded-2xl"
        />
      </Link>
      <div className="hidden md:flex">
        {MainLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`mx-3 text-lg hover:text-blue-500 duration-100 ${
              pathName === link.href ? "text-blue-500 " : "text-gray-700  "
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant={"primary"} link="/sign_up">Sign Up</Button>
        <Button
          variant={"outline"}
          onClick={() => setOpenMenu(!openMenu)}
          className="text-primary hover:text-primary/80 md:hidden"
        >
          <Logs size={35} strokeWidth={3} />
        </Button>
      </div>

      <div
        className={`absolute top-20 left-0 w-full bg-background flex flex-col items-center md:hidden border border-gray-200 py-5
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
            className={`my-2 text-lg hover:text-blue-500 duration-100 ${
              pathName === link.href ? "text-blue-500" : "text-gray-700"
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
