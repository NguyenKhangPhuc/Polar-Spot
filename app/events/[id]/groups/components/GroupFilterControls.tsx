"use client";

import React from "react";

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
  const isFilterActive = Boolean(searchQuery.trim()) || sortOrder !== "newest";

  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-5 select-none shadow-xl w-full">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH GROUP NAME / DESCRIPTION
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by group name or description..."
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
        {/* Sort Order Select (md:col-span-10) */}
        <div className="flex flex-col gap-1.5 w-full md:col-span-10">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SORT GROUPS BY
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as GroupSortOrder)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="newest">CREATED DATE: NEWEST FIRST</option>
              <option value="oldest">CREATED DATE: OLDEST FIRST</option>
              <option value="name_asc">GROUP NAME: A TO Z</option>
              <option value="name_desc">GROUP NAME: Z TO A</option>
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
          {isFilterActive ? (
            <button
              type="button"
              onClick={onResetFilters}
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

export default GroupFilterControls;
