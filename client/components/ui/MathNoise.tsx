const MATH_ITEMS = [
  {
    text: "π = 3.14",
    top: "10%",
    left: "15%",
    size: 28,
    rotate: -8,
    duration: 28,
  },
  { text: "∑ x²", top: "22%", left: "70%", size: 34, rotate: 6, duration: 34 },
  { text: "√144", top: "38%", left: "30%", size: 26, rotate: -4, duration: 24 },
  { text: "42", top: "55%", left: "60%", size: 42, rotate: 10, duration: 40 },
  {
    text: "log₂(8)",
    top: "65%",
    left: "18%",
    size: 30,
    rotate: -6,
    duration: 32,
  },
  { text: "∞", top: "78%", left: "75%", size: 48, rotate: 4, duration: 36 },
  {
    text: "e = 2.71",
    top: "85%",
    left: "40%",
    size: 24,
    rotate: -10,
    duration: 26,
  },
];

export function MathNoise() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {MATH_ITEMS.map((item, i) => (
        <span
          key={i}
          className="absolute text-primary text-xl opacity-15 font-mono select-none will-change-transform"
          style={{
            top: item.top,
            left: item.left,
            fontSize: `${item.size}px`,
            animation: `floatSlow ${item.duration}s ease-in-out infinite`,
            ["--r" as any]: `${item.rotate}deg`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
