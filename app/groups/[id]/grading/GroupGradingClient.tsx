"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import BackButton from "@/app/components/BackButton";
import { Criteria } from "@/app/types/event_criteria";
import { UserGroupGrading, UserGroupGradingInsert } from "@/app/types/user_group_grading";
import { upsertUserGroupGrading } from "@/app/actions/user_group_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import GradingSummaryPanel from "./components/GradingSummaryPanel";

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

  const groupName = group.group_name || "Unnamed Group";

  // Build memoized default values mapping criteria_id to numeric grade
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
    control,
    formState: { errors },
  } = useForm<Record<string, number>>({
    defaultValues,
  });

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
      setIsSubmittingLoader(false);
    }
  };

  const setIsSubmittingLoader = (val: boolean) => {
    setIsOpenLoader(val);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Header & Navigation Section */}
      <div className="flex flex-col space-y-4 border-b border-white/12 pb-6">
        <BackButton href={`/events/${group.event_id}/groups`} label="BACK TO EVENT GROUPS" />
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Group Evaluation: <span className="text-[#3be1fe]">{groupName}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
            CRITERIA SCORING &amp; LIVE PERFORMANCE EVALUATION FOR POLAR BEAR PITCHING
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid Layout with reduced summary width (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Evaluation Criteria Rating Form (lg:col-span-7) */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
          <div className="bg-[#121212] border border-white/12 rounded-md p-6 sm:p-8 shadow-xl space-y-8">
            <div className="pb-2 border-b border-white/12">
              <h3 className="text-base font-mono font-bold text-[#3be1fe] uppercase tracking-wider">
                EVALUATION CRITERIA
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Select 1 to 5 stars for each criteria below. All ratings are required.
              </p>
            </div>

            {criteriaList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono italic">
                No evaluation criteria found for this event.
              </div>
            ) : (
              <div className="space-y-6">
                {criteriaList.map((criteria, index) => {
                  const currentGrade = watch(criteria.id);

                  return (
                    <div
                      key={criteria.id}
                      className="bg-[#050505] border border-white/12 rounded-md p-5 flex flex-col gap-4 shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#3be1fe] bg-[#000000] border border-[#3be1fe]/40 px-2 py-0.5 rounded-sm">
                            #{index + 1}
                          </span>
                          <h4 className="text-base font-bold text-white tracking-tight font-sans">
                            {criteria.name || "Unnamed Criteria"}
                          </h4>
                        </div>
                        {criteria.short_description && (
                          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                            {criteria.short_description}
                          </p>
                        )}
                        {errors[criteria.id] && (
                          <p className="text-red-400 text-xs font-mono font-medium mt-1">
                            {errors[criteria.id]?.message}
                          </p>
                        )}
                      </div>

                      {/* Enlarged 5-Star Radio Component with font-size 42px */}
                      <div className="flex items-center justify-start gap-1 pt-2">
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

          {/* Action Submit Button */}
          {criteriaList.length > 0 && (
            <button
              type="submit"
              className="w-full py-3.5 bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-md transition-colors cursor-pointer shadow-lg"
            >
              SUBMIT EVALUATION GRADE
            </button>
          )}
        </form>

        {/* Right Column: Reduced Width Live Grading Summary Panel (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <GradingSummaryPanel
            control={control}
            criteriaList={criteriaList}
            groupName={groupName}
          />
        </div>
      </div>
    </div>
  );
}
