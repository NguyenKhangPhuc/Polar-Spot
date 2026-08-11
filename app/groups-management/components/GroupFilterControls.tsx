"use client";

import React from "react";
import { Event } from "../../types/event";

type SortOrder = "asc" | "desc";

/**
 * PURPOSE:
 * Search bar and filter control panel for filtering groups by group name, sorting by event title, and toggle sort direction.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to isolate filter controls and search state input.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current search query for group name.
 * - setSearchQuery (function, Required): Setter to update search query.
 * - selectedEventFilter (string, Required): Event ID filter ('all' or specific event UUID).
 * - setSelectedEventFilter (function, Required): Setter to update event filter.
 * - sortOrder (SortOrder, Required): Current sort direction ('asc' | 'desc').
 * - setSortOrder (function, Required): Setter to update sort order.
 * - eventsList (Event[], Required): List of events for the event filter dropdown.
 */

interface GroupFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedEventFilter: string;
  setSelectedEventFilter: (eventId: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  eventsList: Event[];
}

export function GroupFilterControls({
  searchQuery,
  setSearchQuery,
  selectedEventFilter,
  setSelectedEventFilter,
  sortOrder,
  setSortOrder,
  eventsList,
}: GroupFilterControlsProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Renders input elements for group name text search, event filtering, and asc/desc sort direction selection.
   * Immediately updates parent orchestrator component state upon user input.
   *
   * PARAMETERS:
   * - props (GroupFilterControlsProps): Search/sort state and callbacks.
   *
   * RETURNS:
   * - JSX.Element: Rendered filter controls card.
   */
  return (
    <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
      {/* Search Input for Group Name */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
          SEARCH BY GROUP NAME
        </label>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by group name or description..."
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
        {/* Event Selector Filter */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
            FILTER / SORT BY EVENT
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 pr-10 rounded-xl outline-none focus:border-white/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="all">ALL EVENTS</option>
              {eventsList.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.short_description || event.location || event.id}
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

        {/* Sort Direction Select */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
            SORT DIRECTION (GROUP NAME)
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
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

export default GroupFilterControls;
