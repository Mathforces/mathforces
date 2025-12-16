"use client";
import { useEffect, useState } from "react";
import { Next_Rank } from "./Next_Rank";
import { useIsMobile } from "@/hook/useIsMobile";
import { ChartColumn } from "lucide-react";

const Right_Side = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleMenu}
          className={`
            fixed top-20 right-5 z-50 bg-primary text-white px-4 py-2 rounded-xl shadow-md transition hover:bg-primary/70 cursor-pointer
            ${menuOpen ? "-translate-y-12" : "translate-y-0"}
            `}
        >
          <ChartColumn size={20} strokeWidth={3} />
        </button>
      )}

      <section
        className={`
          bg-background w-full md:w-2/4 flex flex-col items-center gap-10 py-20 px-5
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? menuOpen
                ? "fixed top-0 left-0 translate-x-0 opacity-100 h-full"
                : "fixed top-0 left-0 translate-x-full opacity-0 pointer-events-none h-full"
              : "translate-x-0 opacity-100"
          }
        `}
      >
        <Next_Rank />
      </section>
    </>
  );
};

export default Right_Side;
