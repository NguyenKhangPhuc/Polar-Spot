"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import RichTextEditor from "@/app/components/RichTextEditor";

interface EventOverviewProps {
  content: any;
  eventId?: string;
  isAdmin?: boolean;
}

const isContentEmpty = (raw: any): boolean => {
  if (!raw) return true;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "[]" || trimmed === '""') return true;
    try {
      const parsed = JSON.parse(trimmed);
      return isContentEmpty(parsed);
    } catch {
      return trimmed.length === 0;
    }
  }
  if (Array.isArray(raw)) {
    if (raw.length === 0) return true;
    return raw.every((node) => {
      if (!node) return true;
      if (Array.isArray(node.children)) {
        return node.children.every(
          (child: any) => !child.text || child.text.trim() === ""
        );
      }
      return false;
    });
  }
  return false;
};

/**
 * PURPOSE:
 * Renders the Overview & Specification panel for the event detail page.
 * Styled after ITEE SPOT's technical specification panel with #00ffec accents
 * and rich-text display. Includes a direct edit button to configure specification.
 */
export default function EventOverview({ content, eventId, isAdmin }: EventOverviewProps) {
  const hasContent = !isContentEmpty(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-hidden shadow-xl"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
            OVERVIEW &amp; SPECIFICATION
          </span>
        </div>

        {/* Direct Edit Button */}
        {eventId && (
          <Link
            href={`/events/${eventId}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#151312] hover:bg-[#00ffec]/10 border border-white/10 hover:border-[#00ffec]/40 text-[11px] font-mono font-bold text-[#b9cbc2] hover:text-[#00ffec] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <svg
              className="w-3.5 h-3.5 text-[#00ffec]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>EDIT SPECIFICATION</span>
          </Link>
        )}
      </div>

      {/* Rich-text Specification Body */}
      <div className="p-6">
        {hasContent ? (
          <RichTextEditor
            value={content}
            readOnly={true}
            className="min-h-[260px] bg-[#151312] border border-white/5 text-[#e8e1df] p-5 md:p-6 rounded-sm shadow-inner"
          />
        ) : (
          <div className="min-h-[200px] flex flex-col items-center justify-center bg-[#151312] border border-white/5 rounded-sm p-8 text-center">
            <svg
              className="w-8 h-8 text-[#83958d]/40 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xs font-mono text-[#83958d] uppercase tracking-wider mb-4">
              No specification content provided
            </p>
            {eventId && (
              <Link
                href={`/events/${eventId}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#00ffec]/10 hover:bg-[#00ffec]/20 border border-[#00ffec]/30 text-[#00ffec] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>ADD SPECIFICATION NOW</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { EventOverview };
