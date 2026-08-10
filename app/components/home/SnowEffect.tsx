"use client";

import { useEffect, useState } from "react";

interface SnowflakeData {
  id: number;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  animationType: "slow" | "medium";
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);

  useEffect(() => {
    // Generate 35 realistic random snowflakes
    const flakes: SnowflakeData[] = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 12 + 6, // 6px - 18px
      duration: Math.random() * 10 + 8, // 8s - 18s
      delay: Math.random() * 8, // 0s - 8s
      opacity: Math.random() * 0.7 + 0.3,
      animationType: i % 2 === 0 ? "slow" : "medium",
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute text-sky-100/70 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationName: flake.animationType === "slow" ? "snowfall-slow" : "snowfall-medium",
            animationDuration: `${flake.duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
