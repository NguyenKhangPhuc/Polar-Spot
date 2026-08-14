"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * PURPOSE:
 * Header section component for the Events Explorer portal. Displays main page title,
 * descriptive subtitle, and active matching events counter badge with smooth Framer Motion entry animations.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/components/EventsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - totalFound (number, Required): Number of events matching active filter parameters.
 */

interface HeaderSectionProps {
  totalFound: number;
}

export function HeaderSection({ totalFound }: HeaderSectionProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Wraps the top title block inside a Framer Motion container with fade-in and slide-down entry transitions.
   * Formats counter badge with singular/plural event suffix.
   *
   * PARAMETERS:
   * - props (HeaderSectionProps): Object containing totalFound count.
   *
   * RETURNS:
   * - JSX.Element: Header section JSX element with animations.
   */
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6"
    >
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Events Explorer
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          UPCOMING &amp; PAST STARTUP PITCHING EVENTS IN OULU, FINLAND
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider">
          {totalFound} {totalFound === 1 ? "EVENT" : "EVENTS"} FOUND
        </span>
      </div>
    </motion.div>
  );
}

export default HeaderSection;
