"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GroupFeedback } from "@/app/types/group_feedbacks";
import { Profile } from "@/app/types/profile";
import { upsertGroupFeedback } from "@/app/actions/group_feedbacks";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

interface GroupFeedbackSectionProps {
  groupId: string;
  groupName: string;
  userId: string;
  profile: (Profile & { role?: string | null }) | null;
  initialFeedback: GroupFeedback | null;
}

interface FeedbackFormData {
  display_name: string;
  description: string;
}

export default function GroupFeedbackSection({
  groupId,
  groupName,
  userId,
  profile,
  initialFeedback,
}: GroupFeedbackSectionProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const [currentFeedback, setCurrentFeedback] = useState<GroupFeedback | null>(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultUserName = profile?.full_name || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      display_name: initialFeedback?.display_name || defaultUserName || "Anonymous",
      description: initialFeedback?.description || "",
    },
  });

  const onSubmit = async (data: FeedbackFormData): Promise<void> => {
    setIsSubmitting(true);
    setIsOpenLoader(true);
    try {
      const res = await upsertGroupFeedback({
        id: currentFeedback?.id,
        group_id: groupId,
        display_name: data.display_name.trim(),
        description: data.description.trim(),
        user_id: userId,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      if (res.data && res.data.length > 0) {
        setCurrentFeedback(res.data[0]);
      }

      showNotification(
        currentFeedback ? "Feedback updated successfully" : "Feedback submitted successfully"
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit feedback";
      showNotification(msg);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-6 relative overflow-hidden select-none shadow-2xl">
      {/* Top Cyan Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]" />

      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono font-bold text-[#00ffec] uppercase tracking-widest">
            QUALITATIVE EVALUATION
          </span>
          <h2 className="text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            Group Feedback & Recommendations
          </h2>
        </div>

        <span
          className={`px-2 py-0.5 border rounded-sm font-mono text-[8px] font-bold uppercase tracking-widest ${
            currentFeedback
              ? "border-[#00ffec]/30 bg-[#00ffec]/10 text-[#00ffec]"
              : "border-white/10 bg-[#151312] text-[#83958d]"
          }`}
        >
          {currentFeedback ? "FEEDBACK SAVED" : "NO FEEDBACK YET"}
        </span>
      </div>

      {currentFeedback && (
        <div className="bg-[#151312] border border-[#00ffec]/20 p-3 rounded-sm flex items-start gap-2.5 text-[11px] font-mono text-[#b9cbc2]">
          <svg className="w-4 h-4 text-[#00ffec] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <span className="text-[#00ffec] font-bold uppercase tracking-wider">Existing feedback loaded: </span>
            <span>Your previous feedback for {groupName} has been loaded below. Editing and submitting will update your review.</span>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-text">
        {/* Display Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-[#83958d] uppercase tracking-wider flex items-center justify-between">
            <span>DISPLAY NAME</span>
            <span className="text-[#00ffec]">*</span>
          </label>
          <div className="relative flex items-center w-full">
            <select
              className="w-full bg-[#151312] text-[#e8e1df] border border-white/10 rounded-sm text-xs p-3 pr-8 outline-none focus:border-[#00ffec]/50 font-mono cursor-pointer appearance-none transition-colors"
              {...register("display_name", {
                required: "Display name is required",
              })}
            >
              {defaultUserName && <option value={defaultUserName}>{defaultUserName}</option>}
              <option value="Anonymous">Anonymous</option>
            </select>
            <svg
              className="w-4 h-4 absolute right-2.5 text-[#83958d] pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {errors.display_name && (
            <p className="text-red-400 text-xs font-mono font-medium">
              {errors.display_name.message}
            </p>
          )}
        </div>

        {/* Feedback Description Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-[#83958d] uppercase tracking-wider flex items-center justify-between">
            <span>FEEDBACK DESCRIPTION</span>
            <span className="text-[#00ffec]">*</span>
          </label>
          <textarea
            rows={5}
            placeholder={`Enter constructive feedback, critique, or advice for ${groupName}...`}
            className="w-full bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border border-white/10 rounded-sm text-xs p-3.5 outline-none focus:border-[#00ffec]/50 font-sans resize-none transition-colors"
            {...register("description", {
              required: "Feedback description is required",
            })}
          />
          {errors.description && (
            <p className="text-red-400 text-xs font-mono font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
          <span className="text-[10px] font-mono text-[#83958d]">
            Feedback will be saved directly for {groupName}.
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#00ffec] hover:bg-[#00e6d4] text-[#00382b] font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>SAVING FEEDBACK...</span>
            ) : (
              <span>{currentFeedback ? "UPDATE FEEDBACK" : "SUBMIT FEEDBACK"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
