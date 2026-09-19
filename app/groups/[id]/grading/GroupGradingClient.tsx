"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { Event } from "@/app/types/event";
import { Criteria } from "@/app/types/event_criteria";
import { UserGroupGrading, UserGroupGradingInsert } from "@/app/types/user_group_grading";
import { upsertUserGroupGrading } from "@/app/actions/user_group_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import GradingSummaryPanel from "./components/GradingSummaryPanel";

interface GroupGradingClientProps {
  group: any;
  event: Event | null;
  criteriaList: Criteria[];
  existingGradings: UserGroupGrading[] | null;
  userId: string;
}

export default function GroupGradingClient({
  group,
  event,
  criteriaList,
  existingGradings,
  userId,
}: GroupGradingClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupName = group.group_name || "Unnamed Group";
  const maxScore = event?.max_score ?? 100;

  // Build memoized default values mapping criteria_id to numeric grade (fallback to 50% of maxScore)
  const defaultValues = useMemo(() => {
    const initialValues: Record<string, number> = {};
    if (criteriaList && criteriaList.length > 0) {
      criteriaList.forEach((criteria) => {
        const found = existingGradings?.find((g) => g.criteria_id === criteria.id);
        if (found && typeof found.grade === "number" && found.grade > 0) {
          initialValues[criteria.id] = found.grade;
        } else {
          initialValues[criteria.id] = Math.round(maxScore / 2);
        }
      });
    }
    return initialValues;
  }, [criteriaList, existingGradings, maxScore]);

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
    setIsSubmitting(true);
    setIsOpenLoader(true);
    try {
      const payload: UserGroupGradingInsert[] = criteriaList.map((criteria) => {
        const rawValue = formData[criteria.id];
        const gradeValue =
          typeof rawValue === "number"
            ? rawValue
            : parseInt(String(rawValue), 10) || 1;
        return {
          user_id: userId,
          group_id: group.id,
          criteria_id: criteria.id,
          grade: gradeValue,
        };
      });

      const { error } = await upsertUserGroupGrading(payload);
      if (error) {
        throw new Error(error);
      }

      showNotification("Grading submitted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Fail to submit group grading";
      showNotification(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <BackButton
          href={group.event_id ? `/events/${group.event_id}/groups` : "/groups-management"}
          label="BACK TO EVENT GROUPS"
          className="mb-0"
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                Group Grading
              </h1>
              <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
                <span>GROUP: {groupName.toUpperCase()}</span>
                <span>|</span>
                <span>EVENT: {event?.title?.toUpperCase() || "POLAR BEAR PITCHING"}</span>
                <span>|</span>
                <span>MAX SCORE: {maxScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Forms */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-text items-start"
      >
        {/* Left Column: Criteria Evaluation Sliders (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-6 relative overflow-hidden select-none shadow-2xl">
            {/* Top Cyan Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]" />

            {/* Section Header with badge */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
                <span>Evaluation Criteria</span>
              </div>
              <span className="px-2 py-0.5 border border-[#00ffec]/20 bg-[#00ffec]/5 text-[#00ffec] rounded-sm font-mono text-[8px] font-bold uppercase tracking-widest">
                Scale: 1 - {maxScore}
              </span>
            </div>

            {criteriaList.length === 0 ? (
              <div className="text-center py-12 text-[#83958d] text-xs font-mono italic">
                No evaluation criteria configured for this event.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {criteriaList.map((criteria, index) => {
                  const currentVal = watch(criteria.id) ?? Math.round(maxScore / 2);

                  return (
                    <motion.div
                      key={criteria.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col gap-3 pb-6 border-b border-white/5 last:border-0 last:pb-0 select-text"
                    >
                      {/* Criteria Title Row */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-mono font-bold text-[#00ffec] bg-[#151312] border border-[#00ffec]/30 px-2 py-0.5 rounded-sm">
                              #{index + 1}
                            </span>
                            <h3 className="font-mono text-sm font-bold text-[#e8e1df] uppercase tracking-wider">
                              {criteria.name || "Unnamed Criteria"}
                            </h3>
                          </div>
                          {criteria.short_description && (
                            <p className="text-[11px] font-mono text-[#b9cbc2] leading-relaxed pt-1 select-text">
                              {criteria.short_description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Technical Range Slider */}
                      <div className="flex items-center gap-4 w-full bg-[#151312] border border-white/5 p-3.5 rounded-sm mt-1 select-none">
                        <input
                          type="range"
                          min="1"
                          max={maxScore}
                          step="1"
                          className="flex-1 accent-[#00ffec] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                          {...register(criteria.id, {
                            valueAsNumber: true,
                            min: 1,
                            max: maxScore,
                          })}
                        />
                        <motion.span
                          key={currentVal}
                          initial={{ scale: 0.92, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="font-mono text-xs text-[#00ffec] font-bold min-w-[5.5rem] w-24 text-right shrink-0 select-text whitespace-nowrap"
                        >
                          {currentVal} / {maxScore}
                        </motion.span>
                      </div>

                      {errors[criteria.id] && (
                        <span className="text-xs text-red-400 font-mono">
                          {errors[criteria.id]?.message}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry Scoreboard Panel (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <GradingSummaryPanel
            control={control}
            criteriaList={criteriaList}
            groupName={groupName}
            maxScore={maxScore}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
