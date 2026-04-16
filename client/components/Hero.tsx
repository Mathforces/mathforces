import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import MathNoise from "./ui/MathNoise";
import { HEADER_MARGIN } from "@/lib/utils";
import TwoSignAnimation from "./twoSignAnimation";
import Hero_cto_buttons from "./hero_cto_buttons";

const Hero = () => {
  return (
    <section
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className={`w-full flex flex-col justify-center items-center gap-5 relative overflow-hidden select-none`}
    >
      <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none">
        <span>
          <span className="text-[190px]">N</span>UM
        </span>
        <span>ITZ</span>
      </h1>

      <h1 className="text-6xl md:text-[150px] font-bold flex items-end justify-end z-50">
        <div>
          <span className="text-7xl md:text-[190px]">N</span>UM
        </div>

        <div className="flex items-start">
          <div className="flex flex-col justify-center items-center gap-2">
            <Plus
              strokeWidth={6}
              className="w-5 md:w-16 h-5 md:h-16 text-primary"
            />
            <div className="w-2 md:w-6 h-7 md:h-16 bg-foreground" />
          </div>
          TZ
        </div>
      </h1>
      <p className="text-center max-w-2xl">
        A collection of challenging and thought-provoking mathematics problems,
        including Olympiad-level questions, intricate puzzles, and exercises
        that require deep reasoning.
      </p>
      <Hero_cto_buttons />
      <MathNoise />
      <TwoSignAnimation />
    </section>
  );
};

export default Hero;
