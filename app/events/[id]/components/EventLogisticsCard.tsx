"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

/**
 * PURPOSE:
 * Sticky left sidebar metadata panel displaying logistics information for a single event (status, group limit, location, dates)
 * and a navigation link button to view registered pitching groups (/events/[id]/groups) with Framer Motion slide-in animations.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events/[id]/SingleEventClient.tsx to isolate metadata logistics UI.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload.
 */

interface EventLogisticsCardProps {
  event: Event;
}

export function EventLogisticsCard({ event }: EventLogisticsCardProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING;

  /**
   * BEHAVIORAL MECHANISM:
   * Renders the sticky left sidebar panel inside motion.aside with slide-in transition.
   * Includes a Next.js Link CTA button navigating to '/events/[id]/groups'.
   *
   * PARAMETERS:
   * - props (EventLogisticsCardProps): Component props object.
   *
   * RETURNS:
   * - JSX.Element: Logistics metadata panel element.
   */
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="lg:col-span-4 bg-[#13243b] border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 sticky top-6"
    >
      <div className="border-b border-white/12 pb-3">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>LOGISTICS &amp; INFO</span>
        </h3>
      </div>

      <div className="space-y-4 text-xs font-medium text-slate-200">
        {/* Status */}
        <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CURRENT STATUS
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOngoing ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-500"
              }`}
            />
            <span className="text-sm font-extrabold uppercase text-white">
              {event.status || "UNSET"}
            </span>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            GROUP CAPACITY LIMIT
          </span>
          <span className="text-sm font-bold text-cyan-300">
            {event.member_per_groups || 5} Members per Group
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              LOCATION / STAGE NODE
            </span>
            <span className="text-sm text-white font-medium">
              {event.location}
            </span>
          </div>
        )}

        {/* Organized Date */}
        {event.organized_date && (
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ORGANIZED DATE &amp; TIME
            </span>
            <span className="text-sm text-white font-medium">
              {new Date(event.organized_date).toLocaleString()}
            </span>
          </div>
        )}

        {/* Start and End Date */}
        {(event.start_date || event.end_date) && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              EVENT DURATION RANGE
            </span>
            <span className="text-sm text-slate-300 font-medium">
              {event.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}{" "}
              - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 space-y-2.5">
        <Link
          href={`/events/${event.id}/groups`}
          className="w-full py-3.5 bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <span>VIEW PITCHING GROUPS</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        <Link
          href={`/events/${event.id}/result`}
          className="w-full py-3.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <span>VIEW EVALUATION RESULTS</span>
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h10" />
          </svg>
        </Link>
      </div>
    </motion.aside>
  );
}

export default EventLogisticsCard;
