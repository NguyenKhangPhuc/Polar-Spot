"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * PURPOSE:
 * Reusable client-side back button component for navigating back to previous routes.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in header sections of sub-pages such as app/events/[id]/edit/EditEventClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13243b] hover:bg-slate-800 border border-white/18 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer w-fit select-none shadow-md"
    >
      <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      BACK TO MANAGEMENT
    </button>
  );
}
