"use client";

import React from "react";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import RichTextEditor from "@/app/components/RichTextEditor";

interface EventContentCardProps {
  event: Event;
}

export function EventContentCard({ event }: EventContentCardProps) {
  const contentString =
    typeof event.content === "string"
      ? event.content
      : JSON.stringify(event.content || "");

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="lg:col-span-8 space-y-6"
    >
      <div className="bg-[#121212] border border-white/12 rounded-md p-6 sm:p-8 shadow-xl space-y-8">
        {/* Short Description Section */}
        {event.short_description && (
          <div className="space-y-2 border-b border-white/12 pb-6">
            <h3 className="text-xs font-mono font-bold text-[#3be1fe] uppercase tracking-wider">
              EVENT OVERVIEW SUMMARY
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {event.short_description}
            </p>
          </div>
        )}

        {/* Rich Text Specification Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#3be1fe] uppercase tracking-wider">
            FULL EVENT SPECIFICATION &amp; GUIDELINES
          </h3>

          <RichTextEditor
            value={contentString}
            readOnly={true}
            className="min-h-[300px] bg-[#000000] border-white/10"
          />
        </div>
      </div>
    </motion.main>
  );
}

export default EventContentCard;
