"use client";

/**
 * PURPOSE:
 * Client Component for evaluating and grading a specific group across event criteria.
 * Renders a form list of event criteria with 5-star radio rating inputs, pre-populates existing scores,
 * and submits grade updates via upsertUserGroupGrading server action.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/groups/[id]/grading/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - group (any, Required): Target group object.
 * - criteriaList (Criteria[], Required): List of event grading criteria sorted by created_at.
 * - existingGradings (UserGroupGrading[], Optional): Previously assigned evaluation records for this user and group.
 * - userId (string, Required): Authenticated evaluator user UUID.
 */

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import BackButton from "@/app/components/BackButton";
import { Criteria } from "@/app/types/event_criteria";
import { UserGroupGrading, UserGroupGradingInsert } from "@/app/types/user_group_grading";
import { upsertUserGroupGrading } from "@/app/actions/user_group_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";

interface GroupGradingClientProps {
  group: any;
  criteriaList: Criteria[];
  existingGradings: UserGroupGrading[] | null;
  userId: string;
}

export default function GroupGradingClient({
  group,
  criteriaList,
  existingGradings,
  userId,
}: GroupGradingClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  // 1. Build memoized default values mapping criteria_id to numeric grade
  const defaultValues = useMemo(() => {
    const initialValues: Record<string, number> = {};
    if (criteriaList && criteriaList.length > 0) {
      criteriaList.forEach((criteria) => {
        const found = existingGradings?.find((g) => g.criteria_id === criteria.id);
        if (found && typeof found.grade === "number" && found.grade > 0) {
          initialValues[criteria.id] = found.grade;
        }
      });
    }
    return initialValues;
  }, [criteriaList, existingGradings]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Record<string, number>>({
    defaultValues,
  });



  /**
   * BEHAVIORAL MECHANISM:
   * Form submission handler. Converts form rating values to integer numbers, constructs
   * an array of UserGroupGradingInsert objects, and triggers upsertUserGroupGrading action.
   *
   * PARAMETERS:
   * - formData (Record<string, number>): Map of criteria ID to numeric star rating grade.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (formData: Record<string, number>): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const payload: UserGroupGradingInsert[] = criteriaList.map((criteria) => {
        const rawValue = formData[criteria.id];
        const gradeValue = typeof rawValue === "number" ? rawValue : parseInt(String(rawValue), 10);
        return {
          user_id: userId,
          group_id: group.id,
          criteria_id: criteria.id,
          grade: gradeValue || 0,
        };
      });

      const { error } = await upsertUserGroupGrading(payload);
      if (error) {
        throw new Error(error);
      }

      showNotification("Grading submitted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Fail to submit group grading";
      showNotification(errorMessage);
    } finally {
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/12">
        <BackButton />
        <div className="text-right">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            EVALUATION &amp; GRADING PORTAL
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            GROUP EVALUATION
          </h1>
        </div>
      </div>

      {/* Group Info Banner */}
      <div className="bg-[#13243b] border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#0a1526] border border-white/20 shrink-0 flex items-center justify-center shadow-lg">
          {group.avatar_url ? (
            <Image
              src={group.avatar_url}
              alt={group.group_name || "Group Avatar"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-sky-950 flex items-center justify-center text-cyan-300 font-extrabold text-2xl">
              {(group.group_name || "G").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            EVALUATING TEAM
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {group.group_name || "Unnamed Group"}
          </h2>
          <p className="text-sm text-slate-300 line-clamp-2">
            {group.short_description || "No description provided for this group."}
          </p>
        </div>
      </div>

      {/* Criteria Evaluation Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-[#13243b] border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-8">
          <div className="border-b border-white/12 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              EVALUATION CRITERIA
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Select 1 to 5 stars for each criteria below. All criteria ratings are required.
            </p>
          </div>

          {criteriaList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No evaluation criteria found for this event.
            </div>
          ) : (
            <div className="divide-y divide-white/10 space-y-6">
              {criteriaList.map((criteria, index) => {
                const currentGrade = watch(criteria.id);

                return (
                  <div
                    key={criteria.id}
                    className={`${index === 0 ? "" : "pt-6"} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                  >
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                          #{index + 1}
                        </span>
                        <h4 className="text-base font-extrabold text-white tracking-tight">
                          {criteria.name || "Unnamed Criteria"}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {criteria.short_description || "No description available."}
                      </p>
                      {errors[criteria.id] && (
                        <p className="text-red-400 text-xs font-medium mt-1">
                          {errors[criteria.id]?.message}
                        </p>
                      )}
                    </div>

                    {/* 5-Star Radio Component */}
                    <div className="shrink-0 flex flex-col items-center md:items-end gap-1">
                      <div className="radio">
                        {[5, 4, 3, 2, 1].map((starVal) => {
                          const isChecked = Number(currentGrade) === starVal;
                          return (
                            <React.Fragment key={starVal}>
                              <input
                                id={`rating-${criteria.id}-${starVal}`}
                                type="radio"
                                value={starVal}
                                checked={isChecked}
                                {...register(criteria.id, {
                                  required: "Please rate this criteria",
                                  valueAsNumber: true,
                                })}
                              />
                              <label
                                htmlFor={`rating-${criteria.id}-${starVal}`}
                                title={`${starVal} star${starVal > 1 ? "s" : ""}`}
                              >
                                <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                              </label>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        {criteriaList.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg shadow-black/50"
            >
              GIVE YOUR GRADE
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
