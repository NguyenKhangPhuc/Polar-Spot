"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface EventCardProps {
  event: Event;
  posterUrl?: string | null;
  index?: number;
}

/**
 * PURPOSE:
 * Renders an individual event card in the Polar-Spot events directory.
 * Adopts ITEE SPOT aesthetic with #00ffec accents, dark surfaces (#1d1b1a),
 * fine-tuned metadata positioning (Location, Capacity, Duration, Org Date),
 * and high-tech terminal button styling.
 */
export function EventCard({ event, posterUrl, index = 0 }: EventCardProps) {
  const isOngoing =
    event.status?.toLowerCase() === EVENT_STATUS.ONGOING.toLowerCase() ||
    event.status?.toUpperCase() === "ONGOING";

  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  /**
   * Formats date string into short uppercase format (e.g. "OCT 24, 2025").
   */
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date
      .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      .toUpperCase();
  };

  /**
   * Formats duration range string (e.g. "OCT 24 - OCT 26").
   */
  const formatDuration = (
    start: string | null | undefined,
    end: string | null | undefined
  ): string => {
    if (!start) return "N/A";
    const sDate = new Date(start);
    if (isNaN(sDate.getTime())) return "N/A";
    const formattedStart = sDate
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase();
    if (!end) return formattedStart;
    const eDate = new Date(end);
    if (isNaN(eDate.getTime())) return formattedStart;
    const formattedEnd = eDate
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase();
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: "easeOut" },
        },
      }}
      className="w-full flex"
    >
      <Link
        href={`/events/${event.id}`}
        className="bg-[#1d1b1a] border border-white/5 overflow-hidden rounded-sm flex flex-col hover:border-[#00ffec]/40 hover:shadow-[0_0_20px_rgba(0,255,236,0.12)] transition-all duration-300 min-h-[460px] group w-full"
      >
        {/* Top Poster Section */}
        <div className="relative w-full h-52 overflow-hidden bg-[#100e0d] shrink-0 border-b border-white/5 flex items-center justify-center">
          {/* Status Badge Tag (Top Left) */}
          <div
            className={`absolute top-3.5 left-3.5 z-20 font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase font-bold rounded-sm border ${
              isOngoing
                ? "bg-[#00ffec]/15 border-[#00ffec]/35 text-[#00ffec] backdrop-blur-md"
                : "bg-[#151312]/80 border-white/10 text-[#83958d] backdrop-blur-md"
            }`}
          >
            {isOngoing ? "[ ONGOING ]" : "[ FINISHED ]"}
          </div>

          {/* Location Badge (Top Right) */}
          {event.location && (
            <div className="absolute top-3.5 right-3.5 z-20 font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase font-semibold rounded-sm border bg-[#151312]/85 backdrop-blur-md border-white/10 text-[#b9cbc2] max-w-[150px] truncate">
              {event.location}
            </div>
          )}

          {/* Poster Image */}
          {posterUrl ? (
            <>
              {/* Ambient blur backdrop for padding */}
              <Image
                alt=""
                src={posterUrl}
                fill
                unoptimized
                aria-hidden="true"
                className="object-cover blur-md opacity-20 scale-110 pointer-events-none"
              />
              {/* Main Poster Image - fits completely inside container */}
              <Image
                alt={eventTitle}
                src={posterUrl}
                fill
                unoptimized
                className="object-contain p-3 relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#83958d] uppercase">
              <svg
                className="w-8 h-8 text-[#83958d]/50 mb-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>NO IMAGE</span>
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {/* Title & Tech Status Icon */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h3 className="text-base md:text-lg font-bold group-hover:text-[#00ffec] transition-colors line-clamp-1 text-[#e8e1df] font-montserrat">
                {eventTitle}
              </h3>
              {isOngoing ? (
                <svg
                  className="w-4 h-4 text-[#00ffec] shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-[#83958d] shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-[#b9cbc2] opacity-75 line-clamp-2 leading-relaxed mb-6">
              {event.short_description || "No short description provided for this event."}
            </p>
          </div>

          <div>
            {/* Metadata Grid (Fine-Tuned 2x2 layout) */}
            <div className="border-t border-white/5 pt-4 mb-6 flex flex-col gap-3 font-mono">
              {/* Row 1: Location & Group Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Location
                  </span>
                  <span className="text-[10px] font-mono text-[#00ffec] font-semibold truncate block">
                    {event.location || "Oulu, Finland"}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Capacity
                  </span>
                  <span className="text-[10px] font-mono text-[#00ffec] font-semibold block">
                    {event.member_per_groups
                      ? `MAX ${event.member_per_groups} M / G`
                      : "OPEN"}
                  </span>
                </div>
              </div>

              {/* Row 2: Duration & Organized Date */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Duration
                  </span>
                  <span className="text-[10px] font-mono text-[#b9cbc2] block truncate">
                    {formatDuration(event.start_date, event.end_date)}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Org Date
                  </span>
                  <span className="text-[10px] font-mono text-[#b9cbc2] block truncate">
                    {formatDate(event.organized_date || event.start_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Terminal Action CTA */}
            <div className="mt-auto">
              {isOngoing ? (
                <span className="block border border-[#00ffec]/40 text-[#00ffec] bg-transparent group-hover:bg-[#00ffec]/10 font-mono text-[9px] uppercase font-bold py-2.5 w-full text-center transition-all duration-300 tracking-widest rounded-none shadow-[0_0_10px_rgba(0,255,236,0.05)]">
                  EXPLORE EVENT &rarr;
                </span>
              ) : (
                <span className="block border border-white/5 text-[#83958d] bg-[#151312]/30 group-hover:border-white/10 group-hover:text-[#e8e1df] font-mono text-[9px] uppercase font-bold py-2.5 w-full text-center tracking-widest rounded-none transition-all">
                  ARCHIVED EVENT &rarr;
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default EventCard;
