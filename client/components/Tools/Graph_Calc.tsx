"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
interface props {
  expressions: unknown;
  setExpressions: Dispatch<SetStateAction<unknown>>;
}
export default function GraphCalculator({
  expressions,
  setExpressions,
}: props) {
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calculatorRef.current) return;

    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_CALCULATOR_URL}?apiKey=${process.env.NEXT_PUBLIC_CALCULATOR_KEY}`;
    script.async = true;

    script.onload = () => {
      // @ts-expect-error Desmos is loaded from the calculator script.
      const calculator = Desmos.GraphingCalculator(calculatorRef.current, {
        expressions: true,
        settingsMenu: true,
      });
      if (expressions) {
        calculator.setExpressions(expressions);
      }
      calculator.observe("expressions", () => {
        console.log("heyyy");
        setExpressions(calculator.getExpressions());
      });

      let prevExp: unknown = null;
      setInterval(() => {
        const curExp = calculator.getExpressions();
        console.log("prevExp:", prevExp);
        console.log("curExp: ", curExp);
        if (curExp != prevExp) {
          prevExp = curExp;
          setExpressions(prevExp);
        }
      }, 500);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    console.log("expressions: ", expressions);
  }, [expressions]);
  return (
    <div ref={calculatorRef} className="w-full h-full rounded-lg border" />
  );
}
