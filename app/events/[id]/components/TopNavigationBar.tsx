"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";

interface TopNavigationBarProps {
  eventId?: string;
}

export function TopNavigationBar({ eventId }: TopNavigationBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center justify-between gap-4"
    >
      <BackButton />
      {eventId && (
        <Link
          href={`/events/${eventId}/result`}
          className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
        >
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h10" />
          </svg>
          <span>VIEW RESULTS</span>
        </Link>
      )}
    </motion.div>
  );
}

export default TopNavigationBar;

