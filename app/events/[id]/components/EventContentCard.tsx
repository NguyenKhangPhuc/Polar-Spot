"use client";

import React from "react";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import RichTextEditor from "@/app/components/RichTextEditor";

/**
 * PURPOSE:
 * Main content panel component for single event detail view. Displays the short overview description
 * and renders rich event specification content using Plate.js in read-only mode with Framer Motion entry animations.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events/[id]/SingleEventClient.tsx to isolate main content rendering.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload.
 */

interface EventContentCardProps {
  event: Event;
}

export function EventContentCard({ event }: EventContentCardProps) {
  const contentString =
    typeof event.content === "string"
      ? event.content
      : JSON.stringify(event.content || "");

  /**
   * BEHAVIORAL MECHANISM:
   * Renders the main content card inside motion.main with slide-up transition.
   * Renders short_description paragraph and Plate.js RichTextEditor in readOnly mode.
   *
   * PARAMETERS:
   * - props (EventContentCardProps): Component props object.
   *
   * RETURNS:
   * - JSX.Element: Main content card element.
   */
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="lg:col-span-8 space-y-6"
    >
      <div className="bg-[#13243b] border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-8">
        {/* Short Description Section */}
        {event.short_description && (
          <div className="space-y-2 border-b border-white/12 pb-6">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              EVENT OVERVIEW SUMMARY
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {event.short_description}
            </p>
          </div>
        )}

        {/* Rich Text Specification Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            FULL EVENT SPECIFICATION &amp; GUIDELINES
          </h3>

          <RichTextEditor
            value={contentString}
            readOnly={true}
            className="min-h-[300px]"
          />
        </div>
      </div>
    </motion.main>
  );
}

export default EventContentCard;
