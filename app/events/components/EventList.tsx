"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "@/app/types/event";
import EventCard from "./EventCard";

/**
 * PURPOSE:
 * Renders the roster list of filtered and sorted events or empty state feedback with Framer Motion AnimatePresence mode popLayout.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/components/EventsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - events (Event[], Required): Array of processed event records to render.
 * - getPosterUrl (function, Required): Function resolving public image URLs for event posters.
 * - onResetFilters (function, Required): Callback triggered when user clicks clear filters button.
 */

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
  /**
   * BEHAVIORAL MECHANISM:
   * Checks if events array contains elements. If empty, renders an animated empty state container with reset CTA.
   * Otherwise iterates over events array wrapped inside AnimatePresence for animated filtering transitions.
   *
   * PARAMETERS:
   * - props (EventListProps): Component parameters object.
   *
   * RETURNS:
   * - JSX.Element: Animated event list or empty state element.
   */
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#13243b] border border-white/20 rounded-2xl p-12 text-center space-y-3 shadow-xl backdrop-blur-md"
      >
        <p className="text-base text-slate-300 font-semibold">
          No events found matching your active filter criteria.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          CLEAR ALL FILTERS
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
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
