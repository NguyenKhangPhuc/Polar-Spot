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
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 border-b border-white/12 pb-8"
    >
      {/* Top Action & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BackButton href={`/events/${event.id}`} label="BACK TO EVENT DETAILS" />

        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-md bg-[#000000] border border-[#3be1fe]/50 text-[#3be1fe] font-mono font-bold text-xs uppercase tracking-wider shadow-sm">
            {totalFound} {totalFound === 1 ? "GROUP" : "GROUPS"} REGISTERED
          </span>

          {event.status && (
            <span
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${
                isOngoing
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-900 text-slate-300 border-slate-700"
              }`}
            >
              STATUS: {String(event.status).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Main Title Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Pitching Groups: <span className="text-[#3be1fe]">{eventTitle}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          REGISTERED TEAMS, ROSTER ALLOCATIONS &amp; STARTUP PITCHING METRICS
        </p>
      </div>

      {/* Rich Metadata Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono text-xs">
        {/* Location / Stage */}
        <div className="bg-[#121212] border border-white/12 rounded-md p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            LOCATION / STAGE
          </span>
          <p className="text-white font-bold truncate">
            {event.location || "N/A"}
          </p>
        </div>

        {/* Capacity Limit */}
        <div className="bg-[#121212] border border-white/12 rounded-md p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            TEAM CAPACITY
          </span>
          <p className="text-[#3be1fe] font-bold">
            {event.member_per_groups || 5} MEMBERS / GROUP MAX
          </p>
        </div>

        {/* Start / End Dates */}
        <div className="bg-[#121212] border border-white/12 rounded-md p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            EVENT DATES
          </span>
          <p className="text-slate-200 truncate">
            {event.start_date ? new Date(event.start_date).toLocaleDateString() : "TBD"} - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "TBD"}
          </p>
        </div>

        {/* Organized Date & Time */}
        <div className="bg-[#121212] border border-white/12 rounded-md p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            ORGANIZED DATE &amp; TIME
          </span>
          <p className="text-slate-200 truncate">
            {event.organized_date ? new Date(event.organized_date).toLocaleString() : "TBD"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default HeaderSection;
