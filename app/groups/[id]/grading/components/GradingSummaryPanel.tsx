"use client";

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
  const formValues = useWatch({ control });

  // Calculate maximum achievable total points (each criteria has max 5 points)
  const maxPossiblePoints = criteriaList.length * 5;

  // Calculate accumulated points sum and count rated criteria
  let totalSumPoints = 0;
  let ratedCount = 0;
  criteriaList.forEach((criteria) => {
    const rawGrade = formValues[criteria.id];
    const numericGrade = typeof rawGrade === "number" ? rawGrade : parseInt(String(rawGrade || 0), 10);
    if (!isNaN(numericGrade) && numericGrade > 0) {
      totalSumPoints += numericGrade;
      ratedCount += 1;
    }
  });

  // Calculate average score out of 5.0
  const averageScore = criteriaList.length > 0
    ? (totalSumPoints / criteriaList.length).toFixed(1)
    : "0.0";

  const overallPercentage = maxPossiblePoints > 0
    ? Math.round((totalSumPoints / maxPossiblePoints) * 100)
    : 0;

  return (
    <div className="bg-[#121212] border border-white/12 rounded-md p-5 sm:p-6 shadow-xl flex flex-col gap-6 sticky top-6 font-mono text-xs">
      {/* Header Title & Badge */}
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#3be1fe] uppercase tracking-widest block">
            LIVE SCORE SUMMARY
          </span>
          <h3 className="text-lg font-black text-white tracking-tight uppercase font-sans">
            GRADING BREAKDOWN
          </h3>
        </div>
        <div className="px-3 py-1 rounded-md bg-[#000000] border border-[#3be1fe]/40 text-[#3be1fe] font-bold text-xs truncate max-w-[160px]">
          {groupName || "EVALUATION"}
        </div>
      </div>

      {/* Criteria Breakdown List */}
      <div className="space-y-3 flex-1">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          CRITERIA SCORES ({ratedCount}/{criteriaList.length} RATED)
        </span>

        {criteriaList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No criteria loaded.</p>
        ) : (
          <div className="space-y-2.5">
            {criteriaList.map((criteria, index) => {
              const rawGrade = formValues[criteria.id];
              const score = typeof rawGrade === "number" ? rawGrade : parseInt(String(rawGrade || 0), 10) || 0;
              const hasScore = score > 0;

              return (
                <div
                  key={criteria.id}
                  className="bg-[#050505] border border-white/12 rounded-md p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-sm bg-[#000000] border border-white/15 text-[#3be1fe] flex items-center justify-center text-[10px] font-bold shrink-0 font-mono">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate font-sans">
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
                            starIdx <= score ? "text-[#3be1fe] fill-current drop-shadow-[0_0_6px_rgba(59,225,254,0.8)]" : "text-slate-700 fill-current"
                          }`}
                          viewBox="0 0 576 512"
                        >
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-xs font-bold pl-1 ${hasScore ? "text-[#3be1fe]" : "text-slate-500"}`}>
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
      <div className="h-px bg-white/12 my-1" />

      {/* Average Final Score Display Box */}
      <div className="bg-[#050505] border border-[#3be1fe]/40 rounded-md p-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] font-bold text-[#3be1fe] uppercase tracking-widest block">
            AVERAGE SCORE RATING
          </span>
          <h4 className="text-sm font-black text-white uppercase tracking-tight font-sans">
            FINAL SCORE
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">
            {overallPercentage}% of max grade
          </span>
        </div>

        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-black text-[#3be1fe] tracking-tight drop-shadow-[0_0_10px_rgba(59,225,254,0.5)]">
            {averageScore}
            <span className="text-xs font-semibold text-slate-400">/5.0</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AVERAGE GRADE
          </span>
        </div>
      </div>
    </div>
  );
}

export default GradingSummaryPanel;
