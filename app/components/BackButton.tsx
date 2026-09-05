"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export default function BackButton({
  label = "BACK",
  href,
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const baseStyles =
    "cursor-pointer duration-300 inline-flex items-center gap-2 text-xs font-mono text-[#83958d] hover:text-[#00ffec] transition-colors mb-6 group select-none";

  const content = (
    <>
      <svg
        className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300 text-[#00ffec] shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(baseStyles, className)}
    >
      {content}
    </button>
  );
}
