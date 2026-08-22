"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface HeroBannerProps {
  event: Event;
  posterUrl: string | null;
}

export function HeroBanner({ event, posterUrl }: HeroBannerProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING;
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full h-72 sm:h-96 md:h-[400px] rounded-md overflow-hidden border border-white/12 shadow-2xl bg-[#121212] flex items-center justify-center group"
    >
      {posterUrl ? (
        <>
          {/* Ambient Blurred Backdrop */}
          <Image
            src={posterUrl}
            alt=""
            fill
            unoptimized
            aria-hidden="true"
            className="object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
          />
          {/* Main Poster Image */}
          <Image
            src={posterUrl}
            alt={eventTitle}
            fill
            unoptimized
            priority
            className="object-contain p-4 relative z-10"
          />
        </>
      ) : (
        <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
          <svg className="w-16 h-16 text-[#3be1fe]/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            OFFICIAL POLAR BEAR PITCHING STAGE
          </span>
        </div>
      )}

      {/* Dark Gradient Overlay for Title High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent z-10" />

      {/* Title & Badges Overlaid Directly On Top */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="absolute bottom-6 left-6 right-6 z-20 space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-sm text-[10px] font-mono font-black uppercase tracking-wider border backdrop-blur-md ${
              isOngoing
                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                : "bg-black/90 text-slate-300 border-white/20"
            }`}
          >
            {event.status || "STATUS_UNSET"}
          </span>

          {event.member_per_groups && (
            <span className="px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[#3be1fe]/10 text-[#3be1fe] border border-[#3be1fe]/40 backdrop-blur-md">
              MAX {event.member_per_groups} MEMBERS / GROUP
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {eventTitle}
        </h1>
      </motion.div>
    </motion.div>
  );
}

export default HeroBanner;
