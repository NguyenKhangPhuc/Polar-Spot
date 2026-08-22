"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GroupFinalScore } from "@/app/types/final_score";

interface GroupCriteriaResultTableProps {
  filteredScores: GroupFinalScore[];
  userId: string | null;
}

export function GroupCriteriaResultTable({
  filteredScores,
  userId,
}: GroupCriteriaResultTableProps) {
  const uniqueCriteriaList = useMemo(() => {
    const criteriaMap = new Map<string, string>();
    filteredScores.forEach((group) => {
      (group.criteria || []).forEach((crit) => {
        if (crit.criteria_id && !criteriaMap.has(crit.criteria_id)) {
          criteriaMap.set(crit.criteria_id, crit.criteria_name || "UNNAMED CRITERIA");
        }
      });
    });
    return Array.from(criteriaMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [filteredScores]);

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-200 uppercase tracking-widest select-none">
        <span className="text-[#3be1fe]">FINAL RESULT</span>
        <span className="text-[10px] text-slate-400 font-normal">
          ({filteredScores.length} {filteredScores.length === 1 ? "ENTRY" : "ENTRIES"})
        </span>
      </div>

      {/* Scrollable Table Container */}
      <div className="bg-[#121212] border border-white/12 rounded-md overflow-x-auto shadow-xl">
        <table className="w-full border-collapse font-mono text-xs text-slate-200 text-left min-w-[750px]">
          <thead>
            <tr className="border-b border-white/12 bg-[#000000] text-[#3be1fe] select-none text-[11px] uppercase tracking-wider font-bold">
              <th className="py-3 px-4 min-w-[180px]">GROUP_NAME</th>
              {uniqueCriteriaList.map((crit) => (
                <th
                  key={crit.id}
                  className="py-3 px-4 text-center whitespace-nowrap border-l border-white/10"
                >
                  <span className="block">{crit.name.toUpperCase()}</span>
                  <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                    AVG SCORE
                  </span>
                </th>
              ))}
              <th className="py-3 px-4 text-center text-[#3be1fe] w-32 whitespace-nowrap border-l border-white/12">
                FINAL_SCORE
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredScores.length > 0 ? (
                filteredScores.map((score, index) => {
                  const groupName = score.group_name || "UNNAMED_GROUP";

                  return (
                    <motion.tr
                      key={score.group_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                    >
                      {/* Group Name Column */}
                      <td className="py-2.5 px-4 font-bold text-white max-w-[220px] truncate hover:text-[#3be1fe] transition-colors">
                        <Link
                          href={`/groups/${score.group_id}/grading`}
                          className="flex items-center gap-2 group"
                        >
                          <span className="text-slate-500 text-[10px] font-normal w-5 text-right font-mono">
                            {String(index + 1).padStart(2, "0")}.
                          </span>
                          <span className="truncate group-hover:underline font-sans text-xs">
                            {groupName}
                          </span>
                        </Link>
                      </td>

                      {/* Criteria Score Columns (Dynamic Width matching Criteria Title text) */}
                      {uniqueCriteriaList.map((crit) => {
                        const cell = score.criteria?.find(
                          (c) => c.criteria_id === crit.id
                        );
                        const userGradeObj = cell?.graders?.find(
                          (g) => userId && g.user_id === userId
                        );
                        const userGrade = userGradeObj?.grade;

                        return (
                          <td
                            key={crit.id}
                            className="py-2.5 px-4 text-center whitespace-nowrap border-l border-white/10"
                          >
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              {/* Average Score */}
                              <span className="font-bold text-xs text-white">
                                {cell?.avg_score !== null && cell?.avg_score !== undefined
                                  ? cell.avg_score.toFixed(1)
                                  : "0.0"}
                              </span>

                              {/* Logged-in User Evaluation Grade Badge */}
                              <span className="text-[9px] font-mono tracking-wider uppercase">
                                {userGrade !== undefined && userGrade !== null ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded-sm bg-[#3be1fe]/10 text-[#3be1fe] border border-[#3be1fe]/30 font-bold">
                                    YOURS: {userGrade}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-medium text-[9px]">
                                    NOT_GRADED
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Final Evaluation Score (Compact & Centered) */}
                      <td className="py-2.5 px-4 text-center w-32 whitespace-nowrap border-l border-white/12 font-bold">
                        <span className="inline-block px-3 py-1 rounded-md bg-[#000000] border border-[#3be1fe]/50 text-[#3be1fe] font-black text-xs shadow-inner">
                          {score.final_avg_score !== null && score.final_avg_score !== undefined
                            ? score.final_avg_score.toFixed(1)
                            : "0.0"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={2 + uniqueCriteriaList.length}
                    className="p-12 text-center text-slate-400 italic select-none text-xs"
                  >
                    NO GROUP SCORE ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GroupCriteriaResultTable;
