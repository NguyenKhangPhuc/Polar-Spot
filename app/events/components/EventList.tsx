"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "@/app/types/event";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  getPosterUrl: (posterPath: string | null | undefined) => string | null;
  onResetFilters: () => void;
}

export function EventList({
  events,
  getPosterUrl,
  onResetFilters,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-white/12 rounded-md p-12 text-center space-y-4 shadow-xl"
      >
        <p className="text-sm text-slate-300 font-semibold font-mono">
          NO EVENTS FOUND MATCHING ACTIVE FILTER CRITERIA
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2.5 rounded-md bg-[#3be1fe] hover:bg-[#6ee7fc] text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          CLEAR ALL FILTERS
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            posterUrl={getPosterUrl(event.poster_path)}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default EventList;
