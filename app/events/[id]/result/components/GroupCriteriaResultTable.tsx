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
      <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-widest select-none">
        <span className="text-[#00ffec]">FINAL RESULT</span>
        <span className="text-[10px] text-[#83958d] font-normal">
          ({filteredScores.length} {filteredScores.length === 1 ? "ENTRY" : "ENTRIES"})
        </span>
      </div>

      {/* Scrollable Table Container */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
        <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[750px]">
          <thead>
            <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
              <th className="p-4 font-bold text-center w-14">NO</th>
              <th className="p-4 font-bold min-w-[180px]">GROUP NAME</th>
              {uniqueCriteriaList.map((crit) => (
                <th
                  key={crit.id}
                  className="p-4 text-center whitespace-nowrap min-w-[130px] align-top"
                >
                  <div className="flex flex-col items-center justify-start text-center w-full">
                    <span className="block font-bold text-[#83958d] text-[8.5px] uppercase tracking-wider text-center" title={crit.name}>
                      {crit.name.toUpperCase()}
                    </span>
                    <span className="block text-[7.5px] font-medium text-[#83958d]/70 mt-0.5 text-center uppercase tracking-widest">
                      AVG SCORE
                    </span>
                  </div>
                </th>
              ))}
              <th className="p-4 font-bold text-center w-36">FINAL SCORE</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredScores.length > 0 ? (
                filteredScores.map((score, index) => {
                  const groupName = score.group_name || "UNREGISTERED GROUP";

                  return (
                    <motion.tr
                      key={score.group_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Index / NO */}
                      <td className="p-4 text-center font-bold text-[#83958d]">
                        {String(index + 1).padStart(3, "0")}
                      </td>

                      {/* Group Name Column */}
                      <td className="p-4 text-[#e8e1df] font-bold whitespace-nowrap">
                        <Link
                          href={`/groups/${score.group_id}/grading`}
                          className="hover:text-[#00ffec] transition-colors"
                        >
                          {groupName}
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
                            className="p-4 text-center whitespace-nowrap"
                          >
                            <div className="flex flex-col items-center justify-center gap-1">
                              {/* Average Score */}
                              <span className="font-bold text-[10px] text-[#e8e1df]">
                                {cell?.avg_score !== null && cell?.avg_score !== undefined
                                  ? cell.avg_score.toFixed(1)
                                  : "0.0"}
                              </span>

                              {/* Logged-in User Evaluation Grade Badge */}
                              <span className="text-[8px] font-mono tracking-wider uppercase">
                                {userGrade !== undefined && userGrade !== null ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded-sm bg-[#151312] text-[#00ffec] border border-white/5 font-bold">
                                    YOURS: {userGrade}
                                  </span>
                                ) : (
                                  <span className="text-[#83958d]/50 font-medium text-[8px]">
                                    NOT GRADED
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Final Evaluation Score */}
                      <td className="p-4 text-center w-36 whitespace-nowrap font-bold">
                        <span className="inline-block px-3 py-1 rounded-sm bg-[#151312] border border-white/5 text-[#00ffec] font-bold text-[9px] shadow-sm">
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
                    colSpan={3 + uniqueCriteriaList.length}
                    className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
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
