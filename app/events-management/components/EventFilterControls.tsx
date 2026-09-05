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
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== "" || sortBy !== "asc";

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("");
    setSortBy("asc");
  };

  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-5 select-none shadow-xl">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH EVENT TITLE / DESCRIPTION / LOCATION
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by event title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs pl-10 pr-3 py-3 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full placeholder:text-[#83958d]/50"
          />
          <svg
            className="w-4 h-4 absolute left-3 text-[#00ffec] pointer-events-none"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 w-full items-end">
        {/* Status Filter (md:col-span-5) */}
        <div className="flex flex-col gap-1.5 w-full md:col-span-5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY STATUS
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as EVENT_STATUS | "")
              }
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="">ALL STATUSES</option>
              {Object.entries(EVENT_STATUS).map(([key, val]) => (
                <option key={key} value={val}>
                  {key.toUpperCase()} ({val})
                </option>
              ))}
            </select>
            <svg
              className="w-4 h-4 absolute right-2.5 text-[#83958d] pointer-events-none"
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

        {/* Sort Order Select (md:col-span-5) */}
        <div className="flex flex-col gap-1.5 w-full md:col-span-5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SORT BY TITLE
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="asc">A - Z (ASCENDING)</option>
              <option value="desc">Z - A (DESCENDING)</option>
            </select>
            <svg
              className="w-4 h-4 absolute right-2.5 text-[#83958d] pointer-events-none"
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

        {/* Reset Button (md:col-span-2) */}
        <div className="md:col-span-2 flex items-center">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-3 bg-[#151312] hover:bg-[#00ffec]/10 text-[#00ffec] border border-[#00ffec]/30 font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer"
            >
              RESET
            </button>
          ) : (
            <div className="w-full py-3 text-center text-[10px] font-mono text-[#83958d]/50 uppercase tracking-widest">
              [DEFAULT]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventFilterControls;
