"use client";

import React from "react";
import { motion } from "framer-motion";

export type GroupSortOrder = "newest" | "oldest" | "name_asc" | "name_desc";

interface GroupFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: GroupSortOrder;
  setSortOrder: (order: GroupSortOrder) => void;
  onResetFilters: () => void;
}

export function GroupFilterControls({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  onResetFilters,
}: GroupFilterControlsProps) {
  const isFilterActive = searchQuery || sortOrder !== "newest";

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="lg:col-span-4 bg-[#121212] border border-white/12 rounded-md p-5 sm:p-6 shadow-xl space-y-6 sticky top-6 font-mono text-xs"
    >
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <h3 className="text-xs font-mono font-bold text-[#3be1fe] uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>FILTER GROUPS</span>
        </h3>

        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[10px] font-bold text-[#3be1fe] hover:underline uppercase tracking-wider transition-colors cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          SEARCH BY GROUP NAME / DESCRIPTION
        </label>
        <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <span className="pl-3 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search group name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3 outline-none border-none font-mono"
          />
        </div>
      </div>

      {/* Sort Order Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          SORT GROUPS BY
        </label>
        <div className="relative flex items-center w-full">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as GroupSortOrder)}
            className="w-full bg-[#050505] border border-white/15 rounded-md text-white text-xs p-3 pr-10 outline-none focus:border-[#3be1fe]/70 transition-colors cursor-pointer uppercase font-mono appearance-none"
          >
            <option value="newest">Created Date: Newest First</option>
            <option value="oldest">Created Date: Oldest First</option>
            <option value="name_asc">Group Name: A to Z</option>
            <option value="name_desc">Group Name: Z to A</option>
          </select>
          <svg
            className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </motion.aside>
  );
}

export default GroupFilterControls;
