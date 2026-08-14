"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

/**
 * PURPOSE:
 * Renders a single event row card in the events roster list with smooth Framer Motion hover effects and entrance transitions.
 * Displays poster image preserving original aspect ratio (object-contain) with an ambient blur backdrop,
 * event title, status and capacity badges, logistics metadata, short description, and navigation CTA button.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/components/EventList.tsx.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record.
 * - posterUrl (string | null, Required): Fully qualified public storage URL or direct link for event poster.
 * - index (number, Optional): Row index for staggered animation delays.
 */

interface EventCardProps {
  event: Event;
  posterUrl: string | null;
  index?: number;
}

export function EventCard({ event, posterUrl, index = 0 }: EventCardProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING;
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  /**
   * BEHAVIORAL MECHANISM:
   * Maps event object properties into a responsive motion.div row card layout.
   * Utilizes staggered entry delays based on index and smooth hover lift animations.
   *
   * PARAMETERS:
   * - props (EventCardProps): Component props object.
   *
   * RETURNS:
   * - JSX.Element: Event row card element with Framer Motion animations.
   */
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="bg-[#13243b] border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-colors flex flex-col md:flex-row gap-6 shadow-xl"
    >
      {/* Event Poster Image Container */}
      <div className="relative w-full md:w-56 h-48 rounded-xl overflow-hidden bg-[#0a1526] border border-white/18 shrink-0 flex items-center justify-center shadow-md">
        {posterUrl ? (
          <>
            {/* Ambient Blurred Backdrop */}
            <Image
              src={posterUrl}
              alt=""
              fill
              unoptimized
              aria-hidden="true"
              className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
            />
            {/* Main Poster Image Maintaining Exact Aspect Ratio */}
            <Image
              src={posterUrl}
              alt={eventTitle}
              fill
              unoptimized
              className="object-contain p-2 relative z-10"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-[#0a1526] to-sky-950 flex flex-col items-center justify-center p-4 text-center">
            <svg className="w-10 h-10 text-cyan-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              NO POSTER
            </span>
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                isOngoing
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-300 border-white/15"
              }`}
            >
              {event.status || "STATUS_UNSET"}
            </span>

            {event.member_per_groups && (
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                MAX {event.member_per_groups} MEMBERS / GROUP
              </span>
            )}
          </div>

          {/* Event Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {eventTitle}
          </h2>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
            {event.location && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.organized_date && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  Organized: {new Date(event.organized_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {(event.start_date || event.end_date) && (
              <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-400">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {event.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}{" "}
                  - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Short Description & CTA Navigation */}
        <div className="space-y-4 pt-3 border-t border-white/10">
          {event.short_description && (
            <p className="text-xs text-slate-400/90 font-normal leading-relaxed line-clamp-3">
              {event.short_description}
            </p>
          )}

          <div className="flex justify-end">
            <Link
              href={`/events/${event.id}`}
              className="px-6 py-3 rounded-xl bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <span>VIEW EVENT DETAILS</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
