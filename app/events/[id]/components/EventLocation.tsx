"use client";

import React from "react";
import { motion } from "framer-motion";

interface EventLocationProps {
  location: string | null | undefined;
}

/**
 * PURPOSE:
 * Renders the Deployment Location panel for the event detail page.
 * Displays physical venue address and Oulu geographic coordinates.
 */
export default function EventLocation({ location }: EventLocationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-hidden shadow-xl"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <svg
          className="w-4 h-4 text-[#00ffec]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
          DEPLOYMENT LOCATION
        </span>
      </div>

      {/* Location Body */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
            Physical Address / Stage
          </span>
          <p className="text-sm text-[#e8e1df] leading-relaxed">
            {location ?? "No physical location specified."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export { EventLocation };
