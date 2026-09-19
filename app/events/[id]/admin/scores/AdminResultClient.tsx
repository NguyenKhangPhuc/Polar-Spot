"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Event } from "@/app/types/event";
import { UserGroupFinalScores } from "@/app/types/all_users_group";
import BackButton from "@/app/components/BackButton";
import UserGradingBreakdown from "../../result/components/UserGradingBreakdown";

interface AdminResultClientProps {
  event: Event | null;
  allUsersGradings: UserGroupFinalScores;
}

export function AdminResultClient({
  event,
  allUsersGradings,
}: AdminResultClientProps) {
  const maxScore = event?.max_score ?? 100;
  const eventId = event?.id || "";

  const eventTitle =
    (event as any)?.title ||
    event?.short_description ||
    event?.location ||
    "EVENT EVALUATION";

  const totalEvaluators = useMemo(() => {
    const set = new Set<string>();
    (allUsersGradings || []).forEach((item) => {
      if (item.full_name) set.add(item.full_name);
    });
    return set.size;
  }, [allUsersGradings]);

  const totalEvaluatedGroups = useMemo(() => {
    const set = new Set<string>();
    (allUsersGradings || []).forEach((item) => {
      if (item.group_name) set.add(item.group_name);
    });
    return set.size;
  }, [allUsersGradings]);

  return (
    <div className="w-full flex flex-col gap-8 select-text font-mono">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-2">
        <BackButton
          href={eventId ? `/events/${eventId}/result` : "/events"}
          label="BACK TO EVENT RESULTS"
          className="mb-0"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                Admin Evaluation Scores
              </h1>
              <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
                <span>EVENT: {eventTitle.toUpperCase()}</span>
                <span>|</span>
                <span>AUDIT &amp; SCORING MATRIX</span>
                <span>|</span>
                <span>MAX SCORE: {maxScore}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={eventId ? `/events/${eventId}/result` : "/events"}
              className="self-start md:self-auto px-4 py-2 rounded-sm bg-[#1d1b1a] hover:bg-[#252220] border border-white/10 text-xs font-bold font-mono text-[#e8e1df] uppercase tracking-wider transition-colors shadow-sm"
            >
              VIEW FINAL RESULTS
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs select-none">
        {/* Metric 1: Total Evaluators */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-bold text-[#83958d] uppercase tracking-wider">
            TOTAL EVALUATORS
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#e8e1df] font-mono">
              {totalEvaluators}
            </span>
            <span className="text-xs text-[#83958d]">JUDGES &amp; USERS</span>
          </div>
        </div>

        {/* Metric 2: Total Groups Graded */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-bold text-[#00ffec] uppercase tracking-wider">
            GROUPS EVALUATED
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#00ffec] font-mono">
              {totalEvaluatedGroups}
            </span>
            <span className="text-xs text-[#b9cbc2]">TEAMS SCORED</span>
          </div>
        </div>

        {/* Metric 3: Total Submissions */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-bold text-[#83958d] uppercase tracking-wider">
            TOTAL EVALUATION ROWS
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#e8e1df] font-mono">
              {allUsersGradings.length}
            </span>
            <span className="text-xs text-[#83958d]">SUBMITTED RECORDS</span>
          </div>
        </div>
      </div>

      {/* User Evaluation Breakdown (Table 1 Criteria & Table 2 Matrix) */}
      <UserGradingBreakdown data={allUsersGradings} />
    </div>
  );
}

export default AdminResultClient;
