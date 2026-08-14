"use client";

import React from "react";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { Event } from "@/app/types/event";

/**
 * PURPOSE:
 * Header section component for the Event Pitching Groups roster portal.
 * Displays BackButton, event title, page header typography, and active matching groups counter badge with Framer Motion entry.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/[id]/groups/components/EventGroupsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload.
 * - totalFound (number, Required): Number of groups matching active search/sort criteria.
 */

interface HeaderSectionProps {
  event: Event;
  totalFound: number;
}

export function HeaderSection({ event, totalFound }: HeaderSectionProps) {
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  /**
   * BEHAVIORAL MECHANISM:
   * Renders the top title block inside a motion.div container with fade-in and slide-down entry transitions.
   *
   * PARAMETERS:
   * - props (HeaderSectionProps): Object containing event record and totalFound count.
   *
   * RETURNS:
   * - JSX.Element: Header section JSX element.
   */
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4 border-b border-white/15 pb-6"
    >
      <div className="flex items-center justify-between">
        <BackButton />
        
        <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider">
          {totalFound} {totalFound === 1 ? "GROUP" : "GROUPS"} REGISTERED
        </span>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Pitching Groups: {eventTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          ROSTER &amp; TEAM MEMBER ALLOCATIONS FOR THIS EVENT STAGE
        </p>
      </div>
    </motion.div>
  );
}

export default HeaderSection;
