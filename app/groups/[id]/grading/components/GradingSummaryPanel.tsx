"use client";

/**
 * PURPOSE:
 * Isolated summary panel component for calculating and displaying live evaluation scores.
 * Subscribes to React Hook Form state using useWatch to prevent parent re-renders when rating values change.
 * Displays individual criteria score breakdowns and calculates the final total point sum.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/groups/[id]/grading/GroupGradingClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - control (Control<Record<string, number>>, Required): React Hook Form control object.
 * - criteriaList (Criteria[], Required): List of event grading criteria.
 * - groupName (string, Optional): Name of the group being evaluated.
 */

import React from "react";
import { Control, useWatch } from "react-hook-form";
import { Criteria } from "@/app/types/event_criteria";

interface GradingSummaryPanelProps {
  control: Control<Record<string, number>>;
  criteriaList: Criteria[];
  groupName?: string;
}

export function GradingSummaryPanel({
  control,
  criteriaList,
  groupName,
}: GradingSummaryPanelProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Subscribes strictly to form field value changes via useWatch without triggering re-renders
   * in the parent GroupGradingClient component. Iterates through criteria values, calculates
   * individual percentages and total accumulated score (Final Point).
   *
   * PARAMETERS:
   * - props (GradingSummaryPanelProps): Control object, criteria list, and group name.
   *
   * RETURNS:
   * - JSX.Element: Live score summary card containing score breakdown and final total points.
   */
  const formValues = useWatch({ control });

  // Calculate maximum achievable total points (each criteria has max 5 points)
  const maxPossiblePoints = criteriaList.length * 5;

  // Calculate current total accumulated points
  let finalPoints = 0;
  criteriaList.forEach((criteria) => {
    const rawGrade = formValues[criteria.id];
    const numericGrade = typeof rawGrade === "number" ? rawGrade : parseInt(String(rawGrade || 0), 10);
    if (!isNaN(numericGrade) && numericGrade > 0) {
      finalPoints += numericGrade;
    }
  });

  const overallPercentage = maxPossiblePoints > 0
    ? Math.round((finalPoints / maxPossiblePoints) * 100)
    : 0;

  return (
    <div className="bg-[#13243b] border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col gap-6 sticky top-6">
      {/* Header Title & Badge */}
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            LIVE SCORE SUMMARY
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight uppercase">
            GRADING BREAKDOWN
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
          {groupName || "GROUP EVALUATION"}
        </div>
      </div>

      {/* Criteria Breakdown List */}
      <div className="space-y-4 flex-1">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          CRITERIA SCORES
        </span>

        {criteriaList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No criteria loaded.</p>
        ) : (
          <div className="space-y-3">
            {criteriaList.map((criteria, index) => {
              const rawGrade = formValues[criteria.id];
              const score = typeof rawGrade === "number" ? rawGrade : parseInt(String(rawGrade || 0), 10) || 0;
              const hasScore = score > 0;

              return (
                <div
                  key={criteria.id}
                  className="bg-[#0a1526] border border-white/12 rounded-xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {criteria.name || "Criteria"}
                    </span>
                  </div>

                  {/* Score Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <svg
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= score ? "text-cyan-400 fill-current drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" : "text-slate-700 fill-current"
                          }`}
                          viewBox="0 0 576 512"
                        >
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-xs font-bold pl-1 ${hasScore ? "text-cyan-300" : "text-slate-400"}`}>
                      {hasScore ? `${score}/5` : "-/5"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/15 my-1" />

      {/* Final Point Display Box */}
      <div className="bg-gradient-to-br from-[#0c1c33] to-[#071324] border border-cyan-500/30 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            ACCUMULATED SCORE
          </span>
          <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            FINAL POINT
          </h4>
          <span className="text-xs text-slate-400 font-medium">
            {overallPercentage}% of maximum score
          </span>
        </div>

        <div className="text-right">
          <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            {finalPoints}
            <span className="text-sm font-semibold text-slate-400">/{maxPossiblePoints}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL POINTS
          </span>
        </div>
      </div>
    </div>
  );
}

export default GradingSummaryPanel;
