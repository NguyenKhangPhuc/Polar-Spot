"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-[#121212] border border-white/12 rounded-md p-5 hover:border-[#3be1fe]/50 transition-all duration-300 flex flex-col justify-between shadow-xl group h-full"
    >
      <div className="space-y-4">
        {/* Clean 1-Layer Image Poster Box */}
        <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-[#050505] border border-white/15 shrink-0 flex items-center justify-center shadow-md">
          {posterUrl ? (
            <>
              {/* Ambient blur backdrop for aspect ratio padding */}
              <Image
                src={posterUrl}
                alt=""
                fill
                unoptimized
                aria-hidden="true"
                className="object-cover blur-md opacity-25 scale-110 pointer-events-none"
              />
              {/* Main Poster Image - fits completely inside container */}
              <Image
                src={posterUrl}
                alt={eventTitle}
                fill
                unoptimized
                className="object-contain p-2 relative z-10 group-hover:scale-105 transition-transform duration-500"
              />
            </>
          ) : (
            <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center p-4 text-center">
              <svg className="w-8 h-8 text-[#3be1fe]/60 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                NO POSTER
              </span>
            </div>
          )}

          {/* Status Badge Overlaid Top Right */}
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-sm text-[9px] font-mono font-black uppercase tracking-wider border shadow-md ${
              isOngoing
                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                : "bg-black/90 text-slate-300 border-white/20"
            }`}
          >
            {event.status || "STATUS_UNSET"}
          </span>
        </div>

        {/* Event Content Details */}
        <div className="space-y-2.5">
          {/* Capacity Badge */}
          {event.member_per_groups && (
            <span className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider bg-[#3be1fe]/10 text-[#3be1fe] border border-[#3be1fe]/30">
              MAX {event.member_per_groups} MEMBERS / GROUP
            </span>
          )}

          {/* Event Title */}
          <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug group-hover:text-[#3be1fe] transition-colors line-clamp-2">
            {eventTitle}
          </h2>

          {/* Logistics Metadata */}
          <div className="space-y-1 text-xs text-slate-300 font-medium pt-1">
            {event.location && (
              <div className="flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 text-[#3be1fe] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.organized_date && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#3be1fe] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.organized_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          {event.short_description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pt-1">
              {event.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Action Button CTA */}
      <div className="pt-4 mt-4 border-t border-white/10">
        <Link
          href={`/events/${event.id}`}
          className="w-full py-2.5 rounded-md bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>VIEW EVENT DETAILS</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

export default EventCard;
