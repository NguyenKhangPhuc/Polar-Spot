"use client";

import React from "react";
import { motion } from "framer-motion";
import { EVENT_STATUS } from "@/app/types/enum";

type SortOrder = "newest" | "oldest";

interface EventFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  onResetFilters: () => void;
}

export function EventFilterControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  onResetFilters,
}: EventFilterControlsProps) {
  const isFilterActive = searchQuery || statusFilter !== "all" || sortOrder !== "newest";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full bg-[#121212] border border-white/12 rounded-md p-5 shadow-xl space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 flex items-center bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3 outline-none border-none font-mono"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              STATUS:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#050505] border border-white/15 rounded-md text-white text-xs px-3 py-2.5 outline-none focus:border-[#3be1fe]/70 transition-colors cursor-pointer font-mono uppercase"
            >
              <option value="all">All Statuses</option>
              <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
              <option value={EVENT_STATUS.FINISHED}>Finished</option>
            </select>
          </div>

          {/* Date Sorting */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              SORT:
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="bg-[#050505] border border-white/15 rounded-md text-white text-xs px-3 py-2.5 outline-none focus:border-[#3be1fe]/70 transition-colors cursor-pointer font-mono uppercase"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Reset Button */}
          {isFilterActive && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              RESET
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EventFilterControls;
