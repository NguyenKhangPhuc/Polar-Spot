"use client";

import React from "react";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { Event } from "@/app/types/event";

interface HeaderSectionProps {
  event: Event;
  totalFound?: number;
}

export function HeaderSection({ event }: HeaderSectionProps) {
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4 border-b border-white/10 pb-6 w-full"
    >
      {/* Back Button Navigation */}
      <div className="flex items-center justify-between gap-3">
        <BackButton href={`/events/${event.id}`} label="BACK TO EVENT DETAILS" />
      </div>

      {/* Main Title Header */}
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
