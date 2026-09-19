"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import { upsertGroupFeedback } from "@/app/actions/group_feedbacks";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { ProfileInsert } from "@/app/types/profile";

interface GiveFeedbackModalProps {
  group: GroupWithMembersAndEvent;
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileInsert;
}

interface FeedbackFormData {
  display_name: string;
  description: string;
}

export function GiveFeedbackModal({
  group,
  isOpen,
  onClose,
  profile,
}: GiveFeedbackModalProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();
  const [userName] = useState<string | null>(profile?.full_name ?? null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      display_name: userName || "Anonymous",
      description: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const res = await upsertGroupFeedback({
        group_id: group.id,
        display_name: data.display_name.trim(),
        description: data.description.trim(),
        user_id: profile?.id,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      showNotification("Feedback submitted successfully");
      reset();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit feedback";
      showNotification(msg);
    } finally {
      setIsOpenLoader(false);
    }
  };

  const groupName = group.group_name || "Unnamed Group";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
          {/* Motion backdrop click listener */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-[#1d1b1a] border border-white/10 rounded-sm p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 z-10 font-mono text-xs text-[#e8e1df]"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-[#00ffec] uppercase tracking-widest block">
                  SUBMIT GROUP FEEDBACK
                </span>
                <h3 className="text-xl font-black text-[#e8e1df] tracking-tight uppercase mt-0.5 font-sans">
                  {groupName}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-sm bg-[#151312] text-[#83958d] hover:text-[#e8e1df] border border-white/10 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Display Name Select Input */}
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
                    {userName && <option value={userName}>{userName}</option>}
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
                  rows={4}
                  placeholder="Enter detailed feedback or suggestions for this startup group..."
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

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#151312] hover:bg-[#252220] text-[#83958d] hover:text-[#e8e1df] font-mono font-bold text-xs uppercase tracking-wider rounded-sm border border-white/10 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00ffec] hover:bg-[#00e6d4] text-[#00382b] font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md"
                >
                  SUBMIT FEEDBACK
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GiveFeedbackModal;
