"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
type Props = {};

function TwoSignAnimation({}: Props) {
  const piRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const two_big_animations = () => {
      if (piRef.current) {
        gsap.fromTo(
          piRef.current,
          {
            x: -200,
            y: 300,
            opacity: 0,
            rotation: -45,
            scale: 0.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 0.7,
            rotation: 45,
            scale: 1,
            duration: 2,
            ease: "power3.out",
            delay: 0.5,
          },
        );
      }

      if (sigmaRef.current) {
        gsap.fromTo(
          sigmaRef.current,
          {
            x: 200,
            y: 300,
            opacity: 0,
            rotation: 45,
            scale: 0.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 0.7,
            rotation: -45,
            scale: 1,
            duration: 2,
            ease: "power3.out",
            delay: 0.7,
          },
        );
      }
    };
    two_big_animations();
  }, []);

  return (
    <div>
      <div
        ref={piRef}
        className="hidden md:block absolute left-0 -bottom-10 text-[600px] font-bold text-primary/40 2xl:text-primary pointer-events-none select-none opacity-0 -z-20"
        style={{ lineHeight: 1 }}
      >
        π
      </div>

      <div
        ref={sigmaRef}
        className="hidden md:block absolute -right-20 -bottom-5 text-[420px] font-bold text-primary/40 2xl:text-primary pointer-events-none select-none opacity-0 -z-20"
        style={{ lineHeight: 1 }}
      >
        x²{" "}
      </div>
    </div>
  );
}

export default TwoSignAnimation;
