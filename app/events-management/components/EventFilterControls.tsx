"use client";

import React from "react";
import { EVENT_STATUS } from "../../types/enum";

type SortOrder = "asc" | "desc";

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
  return (
    <div className="bg-[#121212] border border-white/12 rounded-md p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          SEARCH EVENT NAME / TITLE
        </label>
        <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <svg
            className="w-4 h-4 absolute left-3.5 text-[#3be1fe] pointer-events-none"
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
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by event title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white placeholder-slate-500 text-xs p-3.5 pl-10 outline-none border-none w-full font-mono"
          />
        </div>
      </div>

      {/* Filter & Sort Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            FILTER BY STATUS
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as EVENT_STATUS | "")
              }
              className="bg-[#050505] text-white border border-white/15 text-xs p-3.5 pr-10 rounded-md outline-none focus:border-[#3be1fe]/70 transition-colors w-full appearance-none cursor-pointer uppercase font-mono"
            >
              <option value="">ALL STATUSES</option>
              {Object.entries(EVENT_STATUS).map(([key, val]) => (
                <option key={key} value={val}>
                  {key.toUpperCase()} ({val})
                </option>
              ))}
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

        {/* Sort Order Select */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            SORT (EVENT TITLE)
          </label>
          <div className="relative flex items-center w-full">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              className="bg-[#050505] text-white border border-white/15 text-xs p-3.5 pr-10 rounded-md outline-none focus:border-[#3be1fe]/70 transition-colors w-full appearance-none cursor-pointer uppercase font-mono"
            >
              <option value="asc">A - Z (ASCENDING)</option>
              <option value="desc">Z - A (DESCENDING)</option>
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
      </div>
    </div>
  );
}

export default EventFilterControls;
