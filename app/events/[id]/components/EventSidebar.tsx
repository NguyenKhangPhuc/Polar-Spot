"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface EventSidebarProps {
  event: Event;
  isAdmin?: boolean;
}

/**
 * PURPOSE:
 * Renders the right-hand Technical Specification sidebar for the Single Event page.
 * Displays structured mono metadata (Status, Group Capacity, Execution Timeline,
 * Organized Date & Time) and high-tech action buttons.
 */
export default function EventSidebar({ event, isAdmin }: EventSidebarProps) {
  const isOngoing =
    event.status?.toLowerCase() === EVENT_STATUS.ONGOING.toLowerCase() ||
    event.status?.toUpperCase() === "ONGOING";

  const fmtDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date
      .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      .toUpperCase();
  };

  const fmtTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date
      .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      .toUpperCase();
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
      className="lg:col-span-5 flex flex-col gap-6 sticky top-8"
    >
      {/* Detail Specification Panel */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8e1df]">
            Detail Specification
          </span>
          <svg
            className="w-4 h-4 text-[#00ffec]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Status & Capacity Row */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                Status
              </span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  isOngoing ? "text-[#00ffec]" : "text-[#83958d]"
                }`}
              >
                {event.status?.toUpperCase() ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                Max Capacity
              </span>
              <span className="text-[11px] font-mono font-bold text-[#00ffec]">
                {event.member_per_groups
                  ? `${event.member_per_groups} members / group`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Execution Timeline */}
          <div>
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-3">
              Execution Timeline
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-mono text-[#83958d]">START:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">
                  {fmtDate(event.start_date)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-mono text-[#83958d]">END:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">
                  {fmtDate(event.end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Organized Date and Time */}
          <div className="pt-4 border-t border-white/5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-3">
              Organized Datetime
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-mono text-[#83958d]">DATE:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">
                  {fmtDate(event.organized_date)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-mono text-[#83958d]">TIME:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">
                  {fmtTime(event.organized_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 font-mono">
        {/* Primary Action Button */}
        <Link
          href={`/events/${event.id}/groups`}
          className="w-full py-3 bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 rounded-none shadow-[0_0_15px_rgba(0,255,236,0.15)] flex items-center justify-center gap-2"
        >
          <span>VIEW PITCHING GROUPS</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* Results Action Button */}
        <Link
          href={`/events/${event.id}/result`}
          className="w-full py-3 bg-[#1d1b1a] hover:bg-[#252220] border border-[#00ffec]/40 hover:border-[#00ffec] text-[#00ffec] font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 rounded-none flex items-center justify-center gap-2"
        >
          <span>EVALUATION RESULTS</span>
          <svg className="w-3.5 h-3.5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h10" />
          </svg>
        </Link>

        {/* Edit Event Button (Admin only) */}
        {isAdmin && (
          <Link
            href={`/events/${event.id}/edit`}
            className="w-full py-3 bg-[#1d1b1a] hover:bg-[#252220] border border-white/10 hover:border-[#00ffec]/30 text-[#b9cbc2] hover:text-[#00ffec] font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 rounded-none flex items-center justify-center gap-2"
          >
            <svg
              className="w-3.5 h-3.5 text-[#00ffec]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>EDIT EVENT SPECIFICATION</span>
          </Link>
        )}
      </div>
    </motion.aside>
  );
}

export { EventSidebar };
