"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MATH_ITEMS } from "@/data/MATH_ITEMS";

export default function MathNoise() {
  const itemsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    itemsRef.current.forEach((el, i) => {
      if (!el) return;

      const item = MATH_ITEMS[i];
      const moveX = (i % 2 === 0 ? 30 : -30) * ((i % 3) + 1);
      const moveY = (i % 2 === 0 ? -20 : 20) * ((i % 3) + 1);

      const tl = gsap.timeline({ repeat: -1, delay: i * 0.3 });

      tl.fromTo(
        el,
        {
          opacity: 0,
          x: 0,
          y: 0,
          rotation: item.rotate,
        },
        {
          opacity: 0.15,
          duration: 0.6,
          ease: "power2.out",
        }
      )
        .to(
          el,
          {
            x: moveX,
            y: moveY,
            rotation: -item.rotate,
            duration: item.duration * 0.4,
            ease: "sine.inOut",
          },
          "-=0.3"
        )
        .to(el, {
          x: 0,
          y: 0,
          rotation: item.rotate,
          duration: item.duration * 0.4,
          ease: "sine.inOut",
        })
        .to(
          el,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
          },
          "-=0.3"
        );
    });

    return () => {
      gsap.killTweensOf(itemsRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {MATH_ITEMS.map((item, i) => (
        <span
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
          className="absolute text-blue-600 font-mono select-none"
          style={{
            top: item.top,
            left: item.left,
            fontSize: `${item.size}px`,
            opacity: 0,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
