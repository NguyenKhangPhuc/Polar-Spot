"use client";

import React from "react";
import { motion } from "framer-motion";

interface EventFilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
  selectedSchedule: string;
  onScheduleChange: (schedule: string) => void;
  onResetFilters: () => void;
  isFilterActive: boolean;
}

/**
 * PURPOSE:
 * Renders the left-hand filter sidebar for the Events listing.
 * Implements ITEE SPOT sidebar styling with search input, single status checkboxes
 * (NO registration status), schedule timeframe selector, system uptime indicator,
 * and #00ffec accent styling.
 */
export function EventFilterControls({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  selectedSchedule,
  onScheduleChange,
  onResetFilters,
  isFilterActive,
}: EventFilterControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full flex flex-col gap-6"
    >
      <div className="bg-[#1d1b1a] border border-white/5 p-6 rounded-sm flex flex-col gap-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8e1df]">
            Filters
          </span>
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-2 block">
            Search
          </label>
          <div className="relative flex items-center bg-[#151312] border border-white/10 rounded-sm focus-within:border-[#00ffec] transition-colors">
            <span className="pl-3 text-[#00ffec] flex items-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search title, location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/50 text-xs p-2.5 outline-none font-mono"
            />
          </div>
        </div>

        {/* Single EVENT STATUS Filter (NO registration status) */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-3 block">
            Event Status
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("ongoing")}
                onChange={() => onStatusToggle("ongoing")}
                className="w-4 h-4 border border-[#3a4a44] bg-[#151312] text-[#00ffec] rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00ffec]"
              />
              <span
                className={`${
                  selectedStatuses.includes("ongoing") ? "text-[#00ffec] font-semibold" : "text-[#b9cbc2]"
                } group-hover:text-[#00ffec] transition-colors text-xs font-mono uppercase`}
              >
                Ongoing
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("finished")}
                onChange={() => onStatusToggle("finished")}
                className="w-4 h-4 border border-[#3a4a44] bg-[#151312] text-[#00ffec] rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00ffec]"
              />
              <span
                className={`${
                  selectedStatuses.includes("finished") ? "text-[#00ffec] font-semibold" : "text-[#b9cbc2]"
                } group-hover:text-[#00ffec] transition-colors text-xs font-mono uppercase`}
              >
                Finished
              </span>
            </label>
          </div>
        </div>

        {/* SCHEDULE Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-3 block">
            Schedule
          </label>
          <select
            value={selectedSchedule}
            onChange={(e) => onScheduleChange(e.target.value)}
            className="w-full bg-[#151312] border border-white/10 rounded-sm text-[#e8e1df] py-2 px-3 text-xs font-mono focus:border-[#00ffec] focus:ring-0 cursor-pointer"
          >
            <option value="all" className="bg-[#1d1b1a]">All Dates</option>
            <option value="week" className="bg-[#1d1b1a]">This Week</option>
            <option value="month" className="bg-[#1d1b1a]">This Month</option>
            <option value="upcoming" className="bg-[#1d1b1a]">Upcoming</option>
            <option value="past" className="bg-[#1d1b1a]">Past Dates</option>
          </select>
        </div>

        {/* Reset Button */}
        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2.5 rounded-none bg-[#00ffec]/10 hover:bg-[#00ffec]/20 text-[#00ffec] border border-[#00ffec]/30 text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer text-center"
          >
            RESET ALL FILTERS
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default EventFilterControls;
