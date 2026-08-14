"use client";

import React from "react";
import { motion } from "framer-motion";
import { EVENT_STATUS } from "@/app/types/enum";

type SortOrder = "newest" | "oldest";

/**
 * PURPOSE:
 * Sticky left sidebar filter panel for searching, status filtering, and date sorting events.
 * Enhanced with Framer Motion entry and interactive transitions.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/components/EventsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current search query value.
 * - setSearchQuery (function, Required): Setter function for search query state.
 * - statusFilter (string, Required): Active status filter value.
 * - setStatusFilter (function, Required): Setter function for status filter state.
 * - sortOrder (SortOrder, Required): Active date sort order ('newest' | 'oldest').
 * - setSortOrder (function, Required): Setter function for sort order state.
 * - onResetFilters (function, Required): Callback to clear all active filters.
 */

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

  /**
   * BEHAVIORAL MECHANISM:
   * Renders the sticky left sidebar panel inside a motion.aside element with slide-in entry animation.
   *
   * PARAMETERS:
   * - props (EventFilterControlsProps): Control state values and callbacks.
   *
   * RETURNS:
   * - JSX.Element: Animated filter control panel JSX element.
   */
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="lg:col-span-4 bg-[#13243b] border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 sticky top-6"
    >
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>FILTER EVENTS</span>
        </h3>

        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          SEARCH BY TITLE / LOCATION
        </label>
        <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs p-3 outline-none border-none"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          EVENT STATUS
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-[#0a1526] border border-white/18 rounded-xl text-white text-xs p-3 outline-none focus:border-cyan-400 transition-colors cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
          <option value={EVENT_STATUS.FINISHED}>Finished</option>
        </select>
      </div>

      {/* Date Sorting */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          SORT BY DATE
        </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="w-full bg-[#0a1526] border border-white/18 rounded-xl text-white text-xs p-3 outline-none focus:border-cyan-400 transition-colors cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </motion.aside>
  );
}

export default EventFilterControls;
