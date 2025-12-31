"use client";

import { useEffect, useRef } from "react";

export default function GraphCalculator() {
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calculatorRef.current) return;

    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_CALCULATOR_URL}?apiKey=${process.env.NEXT_PUBLIC_CALCULATOR_KEY}`;
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const calculator = Desmos.GraphingCalculator(calculatorRef.current, {
        expressions: true,
        settingsMenu: true,
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={calculatorRef} className="w-full h-full rounded-lg border" />
  );
}
