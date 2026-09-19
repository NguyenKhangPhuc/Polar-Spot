"use client";

import React from "react";
import { useLoader } from "../context/LoaderContext";

/**
 * PURPOSE:
 * Global backdrop loading overlay for asynchronous operations across the application.
 * Styled after the Cyber-Nordic Obsidian theme with a neon cyan spinning radar ring
 * and sharp minimal card framing.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally inside app/layout.tsx.
 *
 * INPUTS / PARAMETERS:
 * None (consumes state directly from LoaderContext).
 */
export function Loader() {
  const { isOpenLoader } = useLoader();

  /**
   * BEHAVIORAL MECHANISM:
   * Checks the isOpenLoader flag from LoaderContext. If false, returns null to avoid rendering.
   * If true, renders a fixed backdrop overlay with blur effects and a centered glowing dual-ring spinner.
   */
  if (!isOpenLoader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm select-none p-4 font-mono">
      <div className="bg-[#1d1b1a] border border-[#00ffec]/30 rounded-sm p-8 shadow-2xl shadow-black/95 flex flex-col items-center justify-center gap-5 text-center max-w-xs w-full relative overflow-hidden">
        {/* Top cyan neon highlight line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/70" />

        {/* Cyber Neon Ring Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#00ffec] border-r-[#00ffec]/40 animate-spin shadow-[0_0_16px_rgba(0,255,236,0.35)]" />
          <div className="w-2 h-2 rounded-sm bg-[#00ffec] shadow-[0_0_8px_#00ffec]" />
        </div>

        {/* Loading Labels */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#e8e1df] uppercase tracking-widest font-mono">
            PROCESSING...
          </p>
          <p className="text-[9px] text-[#83958d] uppercase tracking-wider font-mono">
            PLEASE WAIT A MOMENT
          </p>
        </div>

        {/* System Activity Indicator */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5 w-full justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] animate-pulse" />
          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SYSTEM OPERATION ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
