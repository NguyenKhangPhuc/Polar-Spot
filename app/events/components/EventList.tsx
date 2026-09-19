"use client";

import React from "react";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  getPosterUrl: (posterPath: string | null | undefined) => string | null;
  onResetFilters: () => void;
}

/**
 * PURPOSE:
 * Renders the 2-column grid of event cards or a technical empty state
 * when no events match active filter criteria.
 */
export function EventList({
  events,
  getPosterUrl,
  onResetFilters,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-[#1d1b1a] border border-white/5 rounded-sm p-16 text-center space-y-4 shadow-xl flex flex-col items-center justify-center"
      >
        <svg
          className="w-10 h-10 text-[#83958d]/60 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xs text-[#b9cbc2] font-semibold font-mono tracking-widest uppercase">
          NO ENTRIES FOUND MATCHING CRITERIA
        </p>
        <p className="text-[11px] text-[#83958d] font-mono max-w-sm">
          Try loosening your search filters or resetting all query parameters.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-2 px-4 py-2 rounded-none bg-[#00ffec]/10 hover:bg-[#00ffec]/20 text-[#00ffec] border border-[#00ffec]/30 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          RESET FILTERS
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
    >
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          posterUrl={getPosterUrl(event.poster_path)}
          index={index}
        />
      ))}
    </motion.div>
  );
}

export default EventList;
