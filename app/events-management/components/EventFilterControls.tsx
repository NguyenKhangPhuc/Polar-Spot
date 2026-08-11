"use client";

import React from "react";
import { EVENT_STATUS } from "../../types/enum";

type SortOrder = "asc" | "desc";

/**
 * PURPOSE:
 * Search bar and filter control panel for filtering events by search query, status enum, and title sort order.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events-management/EventsManagementClient.tsx to isolate filter input controls and search state handling.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current active text query.
 * - setSearchQuery (function, Required): Setter function to update search query.
 * - statusFilter (EVENT_STATUS | "", Required): Active status filter value.
 * - setStatusFilter (function, Required): Setter function to update status filter.
 * - sortBy (SortOrder, Required): Current active title sorting order ('asc' | 'desc').
 * - setSortBy (function, Required): Setter function to update sort order.
 */

interface EventFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: EVENT_STATUS | "";
  setStatusFilter: (status: EVENT_STATUS | "") => void;
  sortBy: SortOrder;
  setSortBy: (sort: SortOrder) => void;
}

export function EventFilterControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: EventFilterControlsProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Provides real-time text input for title/location search and dropdown select controls for status and sort order.
   * Changes immediately propagate to parent orchestrator state through setter callbacks.
   *
   * PARAMETERS:
   * - props (EventFilterControlsProps): Control state properties and setters.
   *
   * RETURNS:
   * - JSX.Element: Rendered filter controls card.
   */
  return (
    <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
      {/* Search Input */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
          SEARCH EVENT NAME / TITLE
        </label>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by event title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-white/50 transition-colors w-full"
          />
          <svg
            className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter & Sort Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {/* Status Filter */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
            FILTER BY STATUS
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as EVENT_STATUS | "")
              }
              className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 pr-10 rounded-xl outline-none focus:border-white/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="">ALL STATUSES</option>
              {Object.entries(EVENT_STATUS).map(([key, val]) => (
                <option key={key} value={val}>
                  {key.toUpperCase()} ({val})
                </option>
              ))}
            </select>
            <svg
              className="w-5 h-5 absolute right-3 text-slate-400 pointer-events-none"
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

        {/* Sort Order Select */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
            SORT (EVENT TITLE)
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 pr-10 rounded-xl outline-none focus:border-white/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="asc">A - Z (ASCENDING)</option>
              <option value="desc">Z - A (DESCENDING)</option>
            </select>
            <svg
              className="w-5 h-5 absolute right-3 text-slate-400 pointer-events-none"
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
      </div>
    </div>
  );
}

export default EventFilterControls;
