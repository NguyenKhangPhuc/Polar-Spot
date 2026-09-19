"use client";

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Criteria } from "@/app/types/event_criteria";

interface GradingSummaryPanelProps {
  control: Control<Record<string, number>>;
  criteriaList: Criteria[];
  groupName?: string;
  maxScore: number;
  isSubmitting?: boolean;
}

export function GradingSummaryPanel({
  control,
  criteriaList,
  groupName,
  maxScore,
  isSubmitting = false,
}: GradingSummaryPanelProps) {
  const formValues = useWatch({ control });

  // Calculate maximum achievable total points
  const maxPossiblePoints = criteriaList.length * maxScore;

  // Calculate accumulated points sum and count rated criteria
  let totalSumPoints = 0;
  let ratedCount = 0;

  criteriaList.forEach((criteria) => {
    const rawGrade = formValues[criteria.id];
    const numericGrade =
      typeof rawGrade === "number" ? rawGrade : Number(rawGrade);
    if (!isNaN(numericGrade) && numericGrade > 0) {
      totalSumPoints += numericGrade;
      ratedCount += 1;
    }
  });

  // Calculate average score out of maxScore
  const averageScore =
    criteriaList.length > 0
      ? (totalSumPoints / criteriaList.length).toFixed(2)
      : "0.00";

  const overallPercentage =
    maxPossiblePoints > 0
      ? Math.round((totalSumPoints / maxPossiblePoints) * 100)
      : 0;

  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-5 relative overflow-hidden select-none font-mono text-xs shadow-2xl">
      {/* Top Cyber Cyan Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]" />

      {/* Header Title & Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          Grading Telemetry
        </span>
        <span className="px-2.5 py-0.5 border border-[#00ffec]/30 bg-[#00ffec]/5 text-[#00ffec] rounded-sm font-mono text-[9px] font-bold uppercase tracking-wider truncate max-w-[170px]">
          {groupName || "Group Evaluation"}
        </span>
      </div>

      {/* Criteria Breakdown List */}
      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
          <span>Criteria Breakdown</span>
          <span>
            {ratedCount}/{criteriaList.length} RATED
          </span>
        </div>

        {criteriaList.length === 0 ? (
          <p className="text-[10px] text-[#83958d] italic py-2">
            No evaluation criteria loaded.
          </p>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            {criteriaList.map((criteria, index) => {
              const rawGrade = formValues[criteria.id];
              const score =
                typeof rawGrade === "number" ? rawGrade : Number(rawGrade) || 0;
              const percentageOfMax =
                maxScore > 0 ? ((score / maxScore) * 100).toFixed(0) : "0";

              return (
                <div
                  key={criteria.id}
                  className="flex justify-between items-center text-[10px] font-mono text-[#b9cbc2]"
                >
                  <span className="truncate max-w-[55%] uppercase tracking-wide text-[#83958d]">
                    #{index + 1} {criteria.name || "Unnamed Criteria"}
                  </span>
                  <span className="shrink-0 text-right select-text font-bold whitespace-nowrap">
                    <span className="text-[#e8e1df]">{score}</span>
                    <span className="text-[#83958d]">/{maxScore}</span>
                    <span className="text-[#00ffec] ml-2 font-mono text-[9px]">
                      ({percentageOfMax}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Score Telemetric Read-out */}
      <div className="flex flex-col items-center justify-center py-6 bg-[#151312] border border-white/5 rounded-sm select-text mt-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,236,0.02)_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

        <motion.span
          key={averageScore}
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-mono font-bold text-[#00ffec] z-10"
        >
          {averageScore}
        </motion.span>
        <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest mt-1 select-none z-10">
          Average Grade / {maxScore}
        </span>
        <span className="text-[8px] font-mono text-[#00ffec]/80 uppercase tracking-widest mt-0.5 select-none z-10">
          Total: {totalSumPoints} / {maxPossiblePoints} ({overallPercentage}%)
        </span>
      </div>

      {/* Verification Notice */}
      <p className="text-[10px] font-mono text-[#83958d] leading-relaxed border-t border-white/5 pt-4">
        Verify all grading criteria sliders are properly calibrated. Submitting
        points syncs grades immediately to the Polar Bear Pitching system database.
      </p>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={isSubmitting || criteriaList.length === 0}
        className="w-full py-3 bg-[#00ffec] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-none cursor-pointer text-center select-none disabled:opacity-50 shadow-md shadow-[#00ffec]/20"
      >
        {isSubmitting ? "Syncing Evaluation..." : "Submit Evaluation"}
      </button>
    </div>
  );
}

export default GradingSummaryPanel;
