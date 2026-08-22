"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Event } from "@/app/types/event";
import { GroupFinalScore } from "@/app/types/final_score";
import { tw } from "@/app/constants/design-tokens";
import GroupCriteriaResultTable from "./components/GroupCriteriaResultTable";

interface EventResultClientProps {
  event: Event | null;
  user: User | null;
  groupFinalScores: GroupFinalScore[];
}

type SortOption = "score_desc" | "score_asc" | "name_asc" | "name_desc";

export function EventResultClient({
  event,
  user,
  groupFinalScores,
}: EventResultClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("score_desc");

  const totalGroupsCount = groupFinalScores.length;
  const topScore = useMemo(() => {
    if (groupFinalScores.length === 0) return 0;
    const max = Math.max(...groupFinalScores.map((s) => s.final_avg_score || 0));
    return max;
  }, [groupFinalScores]);

  const filteredAndSortedScores = useMemo(() => {
    let list = [...groupFinalScores];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        (item.group_name || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const scoreA = a.final_avg_score || 0;
      const scoreB = b.final_avg_score || 0;
      const nameA = (a.group_name || "").toLowerCase();
      const nameB = (b.group_name || "").toLowerCase();

      switch (sortOption) {
        case "score_desc":
          return scoreB - scoreA;
        case "score_asc":
          return scoreA - scoreB;
        case "name_asc":
          return nameA.localeCompare(nameB);
        case "name_desc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });

    return list;
  }, [groupFinalScores, searchQuery, sortOption]);

  const eventTitle = event?.short_description || event?.location || "EVENT EVALUATION";

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 max-w-7xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/12 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href={event ? `/events/${event.id}` : "/events"}
              className="p-2 rounded-md bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Back to Event"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <span className="text-[10px] font-bold text-[#3be1fe] uppercase tracking-widest block font-mono">
                FINAL SCORE EVALUATION
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {eventTitle}
              </h1>
            </div>
          </div>
        </div>

        <Link
          href={event ? `/events/${event.id}` : "/events"}
          className="self-start sm:self-auto px-4 py-2.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white uppercase tracking-wider transition-colors"
        >
          VIEW EVENT OVERVIEW
        </Link>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric 1: Total Groups */}
        <div className={`${tw.bg.card} p-5 rounded-md flex flex-col justify-between`}>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            TOTAL EVALUATED TEAMS
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalGroupsCount}</span>
            <span className="text-xs text-slate-400">GROUPS</span>
          </div>
        </div>

        {/* Metric 2: Highest Average Score */}
        <div className={`${tw.bg.card} p-5 rounded-md flex flex-col justify-between`}>
          <span className="text-xs font-mono font-bold text-[#3be1fe] uppercase tracking-wider">
            TOP EVALUATION SCORE
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#3be1fe]">{topScore.toFixed(1)}</span>
            <span className="text-xs text-sky-200">/ 5.0 MAX</span>
          </div>
        </div>
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0a0a0a] p-4 rounded-md border border-white/12 shadow-md">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search group by name..."
            className="w-full bg-[#000000] text-white border border-white/15 rounded-md px-4 py-2.5 text-sm outline-none focus:border-[#3be1fe]/60 transition-colors font-mono placeholder:text-slate-500"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-mono text-slate-400 uppercase font-semibold">
            SORT BY:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-[#000000] text-white border border-white/15 rounded-md px-3 py-2.5 text-xs font-bold font-mono outline-none uppercase cursor-pointer focus:border-[#3be1fe]/60"
          >
            <option value="score_desc">FINAL SCORE (HIGH TO LOW)</option>
            <option value="score_asc">FINAL SCORE (LOW TO HIGH)</option>
            <option value="name_asc">GROUP NAME (A - Z)</option>
            <option value="name_desc">GROUP NAME (Z - A)</option>
          </select>
        </div>
      </div>

      {/* Main Results Table */}
      <GroupCriteriaResultTable
        filteredScores={filteredAndSortedScores}
        userId={user?.id || null}
      />
    </div>
  );
}

export default EventResultClient;
