"use client";

import React from "react";
import { PROFILE_ROLE } from "@/app/types/enum";

export type SortOrder =
  | "name_asc"
  | "name_desc"
  | "email_asc"
  | "email_desc"
  | "newest"
  | "oldest";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (sort: SortOrder) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function UserFilters({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  sortOrder,
  setSortOrder,
  onResetFilters,
  hasActiveFilters,
}: UserFiltersProps) {
  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-5 select-none shadow-xl">
      {/* Search Bar */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH FULL NAME / EMAIL ADDR
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search by full name or email address..."
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

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 w-full items-end">
        {/* Role Filter dropdown (md:col-span-5) */}
        <div className="flex flex-col gap-1.5 w-full md:col-span-5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY ROLE
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="all">ALL SYSTEM ROLES</option>
              <option value={PROFILE_ROLE.STUDENT}>STUDENT</option>
              <option value={PROFILE_ROLE.JUDGES}>JUDGE</option>
              <option value={PROFILE_ROLE.ADMIN}>ADMIN</option>
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

        {/* Sort selector (md:col-span-5) */}
        <div className="flex flex-col gap-1.5 w-full md:col-span-5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SORT CRITERIA
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer uppercase"
            >
              <option value="name_asc">NAME A TO Z (ASCENDING)</option>
              <option value="name_desc">NAME Z TO A (DESCENDING)</option>
              <option value="email_asc">EMAIL A TO Z (ASCENDING)</option>
              <option value="email_desc">EMAIL Z TO A (DESCENDING)</option>
              <option value="newest">NEWEST CREATED</option>
              <option value="oldest">OLDEST CREATED</option>
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

        {/* Reset Action Button (md:col-span-2) */}
        <div className="md:col-span-2 flex items-center">
          {hasActiveFilters ? (
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
