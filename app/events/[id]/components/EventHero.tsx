"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface EventHeroProps {
  event: Event;
  posterUrl: string | null;
}

/**
 * PURPOSE:
 * Full-width hero banner for the single event detail page.
 * Features an expanded, full-height poster frame on the right and title/metadata on the left.
 */
export default function EventHero({ event, posterUrl }: EventHeroProps) {
  const isOngoing =
    event.status?.toLowerCase() === EVENT_STATUS.ONGOING.toLowerCase() ||
    event.status?.toUpperCase() === "ONGOING";

  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full min-h-[340px] md:min-h-[400px] overflow-hidden rounded-sm border border-white/5 mb-10 flex flex-col justify-end bg-[#100e0d] shadow-2xl group"
    >
      {/* Background Poster Cover & Centered Image */}
      {posterUrl ? (
        <>
          {/* Ambient Blurred Backdrop */}
          <Image
            src={posterUrl}
            alt=""
            fill
            unoptimized
            aria-hidden="true"
            className="object-cover blur-2xl opacity-20 scale-110 pointer-events-none"
            priority
          />
          {/* Centered Contained Poster in the middle of div */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <Image
              src={posterUrl}
              alt={eventTitle}
              fill
              unoptimized
              className="object-contain p-4 md:p-6 drop-shadow-2xl"
              priority
            />
          </div>
          {/* Dark Overlay Gradients for High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-[#151312]/75 to-[#151312]/35 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#100e0d]" />
      )}

      {/* Hero Content Overlaid On Top */}
      <div className="relative z-20 p-8 md:p-10 flex flex-col justify-end gap-3.5 max-w-3xl">
        {/* Status & Meta Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-2 font-mono text-[9px] px-2.5 py-1 tracking-widest uppercase font-bold rounded-sm border backdrop-blur-md ${
              isOngoing
                ? "bg-[#00ffec]/10 border-[#00ffec]/30 text-[#00ffec]"
                : "bg-white/5 border-white/10 text-[#83958d]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOngoing ? "bg-[#00ffec] animate-pulse" : "bg-[#83958d]"
              }`}
            />
            {isOngoing ? "[ ACTIVE ]" : "[ COMPLETED ]"}
          </div>

          {event.member_per_groups && (
            <span className="font-mono text-[9px] px-2.5 py-1 tracking-widest uppercase font-bold rounded-sm border bg-[#151312]/80 border-white/10 text-[#00ffec] backdrop-blur-md">
              MAX {event.member_per_groups} MEMBERS / GROUP
            </span>
          )}

          {event.location && (
            <span className="font-mono text-[9px] px-2.5 py-1 tracking-widest uppercase font-semibold rounded-sm border bg-[#151312]/80 border-white/10 text-[#b9cbc2] backdrop-blur-md truncate max-w-[220px]">
              {event.location}
            </span>
          )}
        </div>

        {/* Title Overlaid */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#e8e1df] font-montserrat drop-shadow-lg">
          {eventTitle}
        </h1>

        {/* Short Description Overlaid */}
        {event.short_description && (
          <p className="text-[#b9cbc2] text-sm md:text-base leading-relaxed opacity-90 drop-shadow-md max-w-2xl">
            {event.short_description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export { EventHero };
