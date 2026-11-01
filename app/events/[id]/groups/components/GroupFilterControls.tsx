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
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-6 select-none shadow-xl w-full">
      {/* Sidebar Header Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3 bg-[#00ffec]" />
          <span className="text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            FILTER &amp; SEARCH
          </span>
        </div>
        {isFilterActive && (
          <span className="text-[9px] font-mono text-[#00ffec] font-bold uppercase tracking-widest bg-[#00ffec]/10 px-2 py-0.5 rounded-sm border border-[#00ffec]/30">
            ACTIVE
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH GROUPS
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by name or pitch..."
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

      {/* Sort Order Select */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SORT ORDER
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

      {/* Reset Action */}
      <div className="pt-2 border-t border-white/5">
        {isFilterActive ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2.5 px-3 bg-[#151312] hover:bg-[#00ffec]/10 text-[#00ffec] border border-[#00ffec]/30 font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer"
          >
            RESET ALL FILTERS
          </button>
        ) : (
          <div className="w-full py-2 text-center text-[9px] font-mono text-[#83958d]/50 uppercase tracking-widest border border-dashed border-white/5 rounded-sm">
            ALL FILTERS DEFAULT
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupFilterControls;
