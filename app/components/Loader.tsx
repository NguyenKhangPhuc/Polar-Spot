"use client";

import React from "react";
import { useLoader } from "../context/LoaderContext";

/**
 * PURPOSE:
 * Global backdrop loading spinner component for the application. Consumes LoaderContext
 * to display a centered Arctic-themed spinner with backdrop blur when global asynchronous operations occur.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally inside app/layout.tsx to serve all client-side pages and server action triggers.
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
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - JSX.Element | null: Rendered global loader backdrop overlay or null.
   */
  if (!isOpenLoader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md select-none p-4">
      <div className="bg-[#13243b]/90 border border-white/20 rounded-2xl p-8 shadow-2xl shadow-black/80 flex flex-col items-center justify-center gap-4 text-center max-w-xs w-full frost-card">
        {/* Glowing Dual-Ring Arctic Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/60" />
          <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-cyan-400 border-r-sky-300 animate-spin shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
        </div>

        {/* Loading Label */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-white uppercase tracking-widest">
            PROCESSING...
          </p>
          <p className="text-[11px] text-sky-200 font-medium">
            PLEASE WAIT A MOMENT
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
