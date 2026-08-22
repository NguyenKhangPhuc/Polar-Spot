"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    "inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#121212] hover:bg-[#18181b] border border-white/15 text-[#3be1fe] hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer w-fit select-none shadow-md";

  const content = (
    <>
      <svg className="w-4 h-4 text-[#3be1fe] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`${baseStyles} ${className}`}
    >
      {content}
    </button>
  );
}
