"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import { upsertGroupFeedback } from "@/app/actions/group_feedbacks";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { createClient } from "@/app/utils/supabase/client";
import { ProfileInsert } from "@/app/types/profile";

interface GiveFeedbackModalProps {
  group: GroupWithMembersAndEvent;
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileInsert
}

interface FeedbackFormData {
  display_name: string;
  description: string;
}

export function GiveFeedbackModal({
  group,
  isOpen,
  onClose,
  profile
}: GiveFeedbackModalProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();
  const [userName, setUserName] = useState<string | null>(profile.full_name!);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      display_name: "Anonymous",
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
        user_id: profile.id
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
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
            className="relative bg-[#121212] border border-white/12 rounded-md p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 z-10"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/12 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#3be1fe] uppercase tracking-widest block">
                  SUBMIT GROUP FEEDBACK
                </span>
                <h3 className="text-xl font-black text-white tracking-tight uppercase mt-0.5">
                  FEEDBACK: {groupName}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md bg-[#050505] text-slate-400 hover:text-white border border-white/15 transition-colors cursor-pointer shrink-0"
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
              <div className="flex flex-col">
                <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
                  <span>DISPLAY NAME</span>
                  <span className="text-[#3be1fe]">*</span>
                </label>
                <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
                  <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
                    <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <select
                    className="w-full bg-[#050505] text-white text-xs p-3.5 pr-10 outline-none border-none font-mono cursor-pointer appearance-none"
                    {...register("display_name", {
                      required: "Display name is required",
                    })}
                  >
                    {userName && <option value={userName}>{userName}</option>}
                    <option value="Anonymous">Anonymous</option>
                  </select>
                  <svg
                    className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.display_name && (
                  <p className="text-red-400 text-xs font-mono font-medium mt-1">
                    {errors.display_name.message}
                  </p>
                )}
              </div>

              {/* Feedback Description Textarea */}
              <div className="flex flex-col">
                <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
                  <span>FEEDBACK DESCRIPTION</span>
                  <span className="text-[#3be1fe]">*</span>
                </label>
                <div className="relative flex w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
                  <textarea
                    rows={4}
                    placeholder="Enter detailed feedback or suggestions for this startup group..."
                    className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3.5 outline-none border-none font-mono resize-none"
                    {...register("description", {
                      required: "Feedback description is required",
                    })}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-xs font-mono font-medium mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-[#050505] hover:bg-white/10 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider rounded-md border border-white/15 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-lg"
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
