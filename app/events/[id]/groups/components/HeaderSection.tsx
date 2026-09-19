"use client";

import React from "react";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { Event } from "@/app/types/event";

interface HeaderSectionProps {
  event: Event;
  totalFound: number;
}

export function HeaderSection({ event, totalFound }: HeaderSectionProps) {
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  const isOngoing = event.status === "ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4 border-b border-white/10 pb-6 w-full"
    >
      {/* Back Button & Status / Count Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <BackButton href={`/events/${event.id}`} label="BACK TO EVENT DETAILS" />

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1.5 rounded-sm bg-[#151312] border border-[#00ffec]/40 text-[#00ffec] font-mono font-bold text-xs uppercase tracking-wider shadow-sm">
            {totalFound} {totalFound === 1 ? "GROUP" : "GROUPS"} REGISTERED
          </span>

          {event.status && (
            <span
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${
                isOngoing
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                  : "bg-[#151312] text-[#83958d] border-white/10"
              }`}
            >
              STATUS: {String(event.status).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Main Title Header (compact near BackButton) */}
      <div className="space-y-1 pt-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#e8e1df] tracking-tight uppercase font-sans">
          PITCHING GROUPS: <span className="text-[#00ffec]">{eventTitle}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#83958d] font-mono uppercase tracking-wider">
          REGISTERED TEAMS, ROSTER ALLOCATIONS &amp; STARTUP PITCHING METRICS
        </p>
      </div>
    </motion.div>
  );
}

export default HeaderSection;
