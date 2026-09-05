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
    // Generate 45 snow particles falling faster and appearing immediately
    const flakes: SnowflakeData[] = Array.from({ length: 45 }).map((_, i) => {
      const duration = Math.random() * 4 + 3.5; // 3.5s - 7.5s (faster fall speed)
      return {
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 7 + 4, // 4px - 11px
        duration,
        // Negative delay ensures snow is already mid-air and falling immediately
        delay: -(Math.random() * duration),
        opacity: Math.random() * 0.35 + 0.65, // 0.65 - 1.0 (bolder, richer visibility)
        animationType: i % 2 === 0 ? "slow" : "medium",
      };
    });
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute rounded-full bg-[#00ffec]/90 shadow-[0_0_12px_rgba(0,255,236,0.95)]"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationName: flake.animationType === "slow" ? "snowfall-slow" : "snowfall-medium",
            animationDuration: `${flake.duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
