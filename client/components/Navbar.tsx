import { MainLinks } from "@/data/Links";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-between md:justify-evenly items-center gap-5 p-5">
      <Image src={"/Logo.png"} alt="logo" width={100} height={100} />
      <div className="hidden md:flex">
        {MainLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="mx-3 text-lg hover:text-blue-500 duration-100"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <Button variant={"primary"}>Sign In</Button>
    </nav>
  );
};

export default Navbar;
