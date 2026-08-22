"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GroupFinalScore } from "@/app/types/final_score";
import { tw } from "@/app/constants/design-tokens";

interface GroupCriteriaResultTableProps {
  filteredScores: GroupFinalScore[];
  userId: string | null;
}

export function GroupCriteriaResultTable({
  filteredScores,
  userId,
}: GroupCriteriaResultTableProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Dynamically aggregates all unique evaluation criteria across all groups in the dataset
   * to construct horizontal dynamic table headers.
   */
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
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-200 uppercase tracking-widest select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
        <span>01_GROUP_CRITERIA_REGISTRY</span>
        <span className="text-[10px] text-slate-400 font-normal">
          ({filteredScores.length} {filteredScores.length === 1 ? "ENTRY" : "ENTRIES"})
        </span>
      </div>

      {/* Scrollable Table Container */}
      <div className={`${tw.bg.card} ${tw.radius.card} overflow-x-auto shadow-2xl`}>
        <table className="w-full border-collapse font-mono text-xs text-slate-200 text-left min-w-[750px]">
          <thead>
            <tr className="border-b border-white/15 bg-[#0a1526] text-slate-300 select-none text-[11px] uppercase tracking-wider font-bold">
              <th className="p-4 sm:p-5 min-w-[180px]">GROUP_NAME</th>
              {uniqueCriteriaList.map((crit) => (
                <th
                  key={crit.id}
                  className="p-4 sm:p-5 text-center min-w-[160px] border-l border-white/10"
                >
                  <span className="block truncate">{crit.name.toUpperCase()}</span>
                  <span className="block text-[9px] font-medium text-sky-300/80 mt-0.5">
                    AVG SCORE
                  </span>
                </th>
              ))}
              <th className="p-4 sm:p-5 text-right text-sky-400 min-w-[150px] border-l border-white/15">
                FINAL_EVALUATION
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
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                    >
                      {/* Group Name Column */}
                      <td className="p-4 sm:p-5 font-bold text-white max-w-[220px] truncate hover:text-sky-300 transition-colors">
                        <Link
                          href={`/groups/${score.group_id}/grading`}
                          className="flex items-center gap-2 group"
                        >
                          <span className="text-slate-500 text-[10px] font-normal w-6 text-right font-mono">
                            {String(index + 1).padStart(2, "0")}.
                          </span>
                          <span className="truncate group-hover:underline">
                            {groupName}
                          </span>
                        </Link>
                      </td>

                      {/* Criteria Score Columns */}
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
                            className="p-4 sm:p-5 text-center border-l border-white/10"
                          >
                            <div className="flex flex-col items-center justify-center gap-1">
                              {/* Average Score */}
                              <span className="font-extrabold text-sm text-white">
                                {cell?.avg_score !== null && cell?.avg_score !== undefined
                                  ? cell.avg_score.toFixed(1)
                                  : "0.0"}
                              </span>

                              {/* Logged-in User Evaluation Grade Badge */}
                              <span className="text-[10px] font-mono tracking-wider uppercase">
                                {userGrade !== undefined && userGrade !== null ? (
                                  <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                                    YOURS: {userGrade}
                                  </span>
                                ) : (
                                  <span className="text-red-400/80 font-medium text-[9px]">
                                    NOT_GRADED_YET
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Final Evaluation Score */}
                      <td className="p-4 sm:p-5 text-right font-black text-base text-sky-400 border-l border-white/15">
                        <span className="inline-block px-3 py-1 rounded-xl bg-sky-950/90 border border-sky-500/50 shadow-inner">
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
                    className="p-16 text-center text-slate-400 italic select-none text-sm"
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
