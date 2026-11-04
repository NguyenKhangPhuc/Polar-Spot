"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Event } from "@/app/types/event";
import { GroupFinalScore } from "@/app/types/final_score";
import BackButton from "@/app/components/BackButton";
import GroupCriteriaResultTable from "./components/GroupCriteriaResultTable";
import { formatScore } from "@/lib/utils";

interface EventResultClientProps {
  event: Event | null;
  user: User | null;
  groupFinalScores: GroupFinalScore[];
}

type SortOption =
  | "score_desc"
  | "score_asc"
  | "your_score_desc"
  | "your_score_asc"
  | "graders_desc"
  | "graders_asc"
  | "name_asc"
  | "name_desc";

export function EventResultClient({
  event,
  user,
  groupFinalScores,
}: EventResultClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("score_desc");

  const maxScore = event?.max_score ?? 100;
  const totalGroupsCount = groupFinalScores.length;

  // Single-pass enrichment to precalculate graders count and user final score
  const enrichedScores = useMemo(() => {
    const currentUserId = user?.id;

    return groupFinalScores.map((score) => {
      // 1. Graders Count
      let totalGraders: number =
        typeof score.total_graders === "number" ? score.total_graders : 0;
      if (typeof score.total_graders !== "number") {
        const uniqueGraders = new Set<string>();
        (score.criteria || []).forEach((crit) => {
          (crit.graders || []).forEach((g) => {
            if (g?.user_id) uniqueGraders.add(g.user_id);
          });
        });
        totalGraders = uniqueGraders.size;
      }

      // 2. User Final Score
      let userScore: number | null =
        typeof score.user_final_score === "number" ? score.user_final_score : null;
      if (userScore === null && currentUserId) {
        const userGrades: number[] = [];
        (score.criteria || []).forEach((crit) => {
          const userGradeObj = crit.graders?.find((g) => g.user_id === currentUserId);
          if (userGradeObj && typeof userGradeObj.grade === "number") {
            userGrades.push(userGradeObj.grade);
          }
        });
        if (userGrades.length > 0) {
          userScore = userGrades.reduce((sum, g) => sum + g, 0) / userGrades.length;
        }
      }

      return {
        ...score,
        total_graders: totalGraders,
        user_final_score: userScore,
      };
    });
  }, [groupFinalScores, user?.id]);

  const topScore = useMemo(() => {
    if (enrichedScores.length === 0) return 0;
    const max = Math.max(...enrichedScores.map((s) => s.final_avg_score || 0));
    return max;
  }, [enrichedScores]);

  const userGradedCount = useMemo(() => {
    if (!user?.id) return 0;
    return enrichedScores.filter((s) => s.user_final_score !== null).length;
  }, [enrichedScores, user?.id]);

  const filteredAndSortedScores = useMemo(() => {
    let list = [...enrichedScores];

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
      const yourScoreA = a.user_final_score;
      const yourScoreB = b.user_final_score;
      const gradersA = a.total_graders || 0;
      const gradersB = b.total_graders || 0;

      switch (sortOption) {
        case "score_desc":
          return scoreB - scoreA;
        case "score_asc":
          return scoreA - scoreB;
        case "your_score_desc":
          return (yourScoreB ?? -1) - (yourScoreA ?? -1);
        case "your_score_asc":
          return (yourScoreA ?? 9999) - (yourScoreB ?? 9999);
        case "graders_desc":
          return gradersB - gradersA;
        case "graders_asc":
          return gradersA - gradersB;
        case "name_asc":
          return nameA.localeCompare(nameB);
        case "name_desc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });

    return list;
  }, [enrichedScores, searchQuery, sortOption]);

  const eventTitle =
    event?.title ||
    event?.short_description ||
    event?.location ||
    "EVENT EVALUATION";

  return (
    <div className="w-full flex flex-col gap-8 select-text font-mono">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-2">
        <BackButton
          href={event ? `/events/${event.id}` : "/events"}
          label="BACK TO EVENT DETAILS"
          className="mb-0"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                Final Score Evaluation
              </h1>
              <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
                <span>EVENT: {eventTitle.toUpperCase()}</span>
                <span>|</span>
                <span>TEAMS: {totalGroupsCount}</span>
                <span>|</span>
                <span>MAX SCORE: {maxScore}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={event ? `/events/${event.id}` : "/events"}
              className="self-start md:self-auto px-4 py-2 rounded-sm bg-[#1d1b1a] hover:bg-[#252220] border border-white/10 text-xs font-bold font-mono text-[#e8e1df] uppercase tracking-wider transition-colors shadow-sm"
            >
              VIEW EVENT OVERVIEW
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs select-none">
        {/* Metric 1: Total Groups */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-bold text-[#83958d] uppercase tracking-wider">
            TOTAL EVALUATED TEAMS
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#e8e1df] font-mono">{totalGroupsCount}</span>
            <span className="text-xs text-[#83958d]">GROUPS REGISTERED</span>
          </div>
        </div>

        {/* Metric 2: Highest Average Score */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#00ffec] uppercase tracking-wider">
              TOP SCORE (AVERAGE)
            </span>
            <span className="text-[7.5px] font-medium text-[#83958d] uppercase tracking-widest">
              OVERALL
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#00ffec] font-mono">{formatScore(topScore, 2)}</span>
            <span className="text-xs text-[#b9cbc2]">/ {maxScore} MAX SCORE</span>
          </div>
        </div>

        {/* Metric 3: User Evaluated Teams */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#83958d] uppercase tracking-wider">
              YOUR EVALUATIONS
            </span>
            <span className="text-[7.5px] font-medium text-[#00ffec] uppercase tracking-widest">
              {totalGroupsCount > 0 && userGradedCount === totalGroupsCount ? "ALL COMPLETED" : "IN PROGRESS"}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#e8e1df] font-mono">{userGradedCount}</span>
            <span className="text-xs text-[#83958d]">/ {totalGroupsCount} TEAMS GRADED</span>
          </div>
        </div>
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1d1b1a] p-4 rounded-sm border border-white/5 shadow-md font-mono text-xs">
        {/* Search Bar */}
        <div className="relative flex items-center flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search group by name..."
            className="w-full bg-[#151312] text-[#e8e1df] border border-white/5 rounded-sm pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#00ffec]/50 transition-colors font-mono placeholder:text-[#83958d]/50"
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

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[7.5px] font-mono text-[#83958d] uppercase font-bold tracking-widest">
            SORT BY:
          </label>
          <div className="relative flex items-center">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 rounded-sm p-2.5 pr-8 text-xs font-bold font-mono outline-none uppercase cursor-pointer focus:border-[#00ffec]/50 appearance-none"
            >
              <option value="score_desc">FINAL SCORE (AVG: HIGH TO LOW)</option>
              <option value="score_asc">FINAL SCORE (AVG: LOW TO HIGH)</option>
              <option value="your_score_desc">YOUR SCORE (HIGH TO LOW)</option>
              <option value="your_score_asc">YOUR SCORE (LOW TO HIGH)</option>
              <option value="graders_desc">GRADERS COUNT (HIGH TO LOW)</option>
              <option value="graders_asc">GRADERS COUNT (LOW TO HIGH)</option>
              <option value="name_asc">GROUP NAME (A - Z)</option>
              <option value="name_desc">GROUP NAME (Z - A)</option>
            </select>
            <svg
              className="w-3.5 h-3.5 absolute right-2.5 text-[#83958d] pointer-events-none"
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

      {/* Main Results Table */}
      <GroupCriteriaResultTable
        filteredScores={filteredAndSortedScores}
        userId={user?.id || null}
      />
    </div>
  );
}

export default EventResultClient;
