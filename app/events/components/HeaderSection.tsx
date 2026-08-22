"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeaderSectionProps {
  totalFound: number;
}

export function HeaderSection({ totalFound }: HeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/12 pb-6"
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
        <span className="px-3.5 py-1.5 rounded-md bg-[#000000] border border-[#3be1fe]/50 text-[#3be1fe] font-bold text-xs uppercase tracking-wider shadow-sm">
          {totalFound} {totalFound === 1 ? "EVENT" : "EVENTS"} FOUND
        </span>
      </div>
    </motion.div>
  );
}

export default HeaderSection;
