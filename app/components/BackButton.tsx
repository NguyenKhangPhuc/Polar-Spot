"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  href?: string;
  className?: string;
}

export default function BackButton({
  label = "BACK",
  fallbackHref,
  href,
  className = "",
}: BackButtonProps) {
  const router = useRouter();
  const fallback = fallbackHref || href;

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (fallback) {
      router.push(fallback);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "cursor-pointer duration-300 inline-flex items-center gap-2 text-xs font-mono text-[#83958d] hover:text-[#00ffec] transition-colors mb-6 group select-none",
        className
      )}
    >
      <svg
        className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300 text-[#00ffec] shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
