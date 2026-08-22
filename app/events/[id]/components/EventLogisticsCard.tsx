"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface EventLogisticsCardProps {
  event: Event;
}

export function EventLogisticsCard({ event }: EventLogisticsCardProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="lg:col-span-4 bg-[#121212] border border-white/12 rounded-md p-5 shadow-xl space-y-5 sticky top-6"
    >
      <div className="border-b border-white/12 pb-3">
        <h3 className="text-sm font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>LOGISTICS &amp; INFO</span>
        </h3>
      </div>

      <div className="space-y-3.5 text-xs font-medium text-slate-200">
        {/* Status */}
        <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            CURRENT STATUS
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOngoing ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-mono font-extrabold uppercase text-white">
              {event.status || "UNSET"}
            </span>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            GROUP CAPACITY LIMIT
          </span>
          <span className="text-xs font-mono font-bold text-[#3be1fe]">
            {event.member_per_groups || 5} Members per Group
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              LOCATION / STAGE NODE
            </span>
            <span className="text-xs text-white font-medium">
              {event.location}
            </span>
          </div>
        )}

        {/* Organized Date */}
        {event.organized_date && (
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ORGANIZED DATE &amp; TIME
            </span>
            <span className="text-xs text-white font-medium">
              {new Date(event.organized_date).toLocaleString()}
            </span>
          </div>
        )}

        {/* Start and End Date */}
        {(event.start_date || event.end_date) && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              EVENT DURATION RANGE
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {event.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}{" "}
              - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 space-y-2 font-mono">
        <Link
          href={`/events/${event.id}/groups`}
          className="w-full py-2.5 bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-bold text-[11px] uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>VIEW PITCHING GROUPS</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        <Link
          href={`/events/${event.id}/result`}
          className="w-full py-2.5 bg-[#050505] hover:bg-[#18181b] text-[#3be1fe] border border-[#3be1fe]/40 font-bold text-[11px] uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>VIEW EVALUATION RESULTS</span>
          <svg className="w-3.5 h-3.5 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h10" />
          </svg>
        </Link>
      </div>
    </motion.aside>
  );
}

export default EventLogisticsCard;
