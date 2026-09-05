"use client";

import React from "react";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";

interface HeaderSectionProps {
  totalFound?: number;
}

/**
 * PURPOSE:
 * Renders the top header banner for the Events Explorer portal.
 * Styled after ITEE SPOT's technical console banner with #00ffec accents,
 * Montserrat headings, and status indicator.
 */
export default function HeaderSection({ totalFound }: HeaderSectionProps) {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      {/* Back to Home Navigation */}
      <BackButton label="BACK TO HOME" href="/" />

      {/* Main Console Header Box */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1d1b1a] border border-white/5 p-8 md:p-10 relative overflow-hidden rounded-sm shadow-xl"
      >
        {/* Decorative Background Tech / Snowflake Icon */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:block pointer-events-none opacity-10 text-[#00ffec]">
          <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 2v20m0-20l3 3m-3-3l-3 3m3 17l3-3m-3 3l-3-3M2 12h20m-20 0l3-3m-3 3l3 3m17-3l-3-3m3 3l-3 3M4.93 4.93l14.14 14.14m-14.14 0l14.14-14.14"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-start text-left">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 select-none text-[#e8e1df] font-montserrat">
            EVENTS
          </h1>

          {/* Subtitle */}
          <p className="text-[#b9cbc2] text-sm md:text-base max-w-2xl leading-relaxed opacity-80">
            Accessing technical pitching competitions, startup hackathons, and innovation workshops within the Polar Bear ecosystem. Filter your target coordinates below.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { HeaderSection };
