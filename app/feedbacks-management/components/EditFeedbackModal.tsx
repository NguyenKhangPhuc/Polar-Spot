"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { updateGroupFeedback } from "@/app/actions/group_feedbacks";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { GroupFeedbackWithGroupAndEvent } from "@/app/types/group_feedbacks";
import { tw } from "@/app/constants/design-tokens";

interface EditFeedbackModalProps {
  feedback: GroupFeedbackWithGroupAndEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackUpdated: (updated: GroupFeedbackWithGroupAndEvent) => void;
}

interface EditFeedbackFormData {
  display_name: string;
  description: string;
}

export function EditFeedbackModal({
  feedback,
  isOpen,
  onClose,
  onFeedbackUpdated,
}: EditFeedbackModalProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFeedbackFormData>({
    defaultValues: {
      display_name: feedback?.display_name || "",
      description: feedback?.description || "",
    },
  });

  useEffect(() => {
    if (isOpen && feedback) {
      reset({
        display_name: feedback.display_name || "",
        description: feedback.description || "",
      });
    }
  }, [isOpen, feedback, reset]);

  if (!feedback) return null;

  const groupName = feedback.groups?.group_name || "Startup Team";
  const eventTitle = feedback.groups?.events?.title || "Event Pitching";

  const onSubmit = async (data: EditFeedbackFormData) => {
    setIsOpenLoader(true);
    try {
      const res = await updateGroupFeedback(
        feedback.id,
        data.description,
        data.display_name
      );

      if (res.error || !res.data) {
        throw new Error(res.error || "Failed to update feedback");
      }

      showNotification("Feedback updated successfully");
      onFeedbackUpdated(res.data);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update feedback";
      showNotification(msg);
    } finally {
      setIsOpenLoader(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
          {/* Backdrop Click Listener */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full max-w-xl ${tw.bg.surfacePanel} border ${tw.border.whiteSubtle} ${tw.radius.card} p-6 sm:p-8 z-10 shadow-2xl flex flex-col gap-6`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between gap-4 border-b ${tw.border.whiteSubtle} pb-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-[3px] h-8 ${tw.bg.accentBar}`} />
                <div>
                  <h3 className={`text-lg sm:text-xl font-extrabold ${tw.text.primary} tracking-tight uppercase font-mono`}>
                    Edit Group Feedback
                  </h3>
                  <div className={`text-[9px] font-mono ${tw.text.subMuted} uppercase tracking-wider flex items-center gap-2 mt-0.5`}>
                    <span className={tw.text.accent}>{groupName}</span>
                    <span>{"//"}</span>
                    <span>{eventTitle}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-sm ${tw.text.subMuted} hover:${tw.text.primary} hover:bg-white/5 transition-colors cursor-pointer`}
                aria-label="Close Modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Display Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-[10px] font-mono ${tw.text.subMuted} uppercase tracking-wider font-bold`}>
                  YOUR DISPLAY NAME
                </label>
                <input
                  type="text"
                  placeholder="Enter your evaluator or judge name..."
                  {...register("display_name", {
                    required: "Display name is required",
                    maxLength: {
                      value: 100,
                      message: "Display name cannot exceed 100 characters",
                    },
                  })}
                  className={`w-full ${tw.bg.surfaceInput} ${tw.radius.button} px-4 py-2.5 text-xs outline-none transition-colors font-mono`}
                />
                {errors.display_name && (
                  <span className="text-red-400 text-[10px] font-mono">
                    {errors.display_name.message}
                  </span>
                )}
              </div>

              {/* Description Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-[10px] font-mono ${tw.text.subMuted} uppercase tracking-wider font-bold`}>
                  FEEDBACK DESCRIPTION
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide detailed feedback, recommendations, and constructive remarks for this group..."
                  {...register("description", {
                    required: "Feedback description is required",
                    minLength: {
                      value: 5,
                      message: "Feedback description must be at least 5 characters",
                    },
                    maxLength: {
                      value: 4000,
                      message: "Feedback description cannot exceed 4000 characters",
                    },
                  })}
                  className={`w-full ${tw.bg.surfaceInput} ${tw.radius.button} p-4 text-xs outline-none transition-colors font-mono leading-relaxed resize-y min-h-[140px]`}
                />
                {errors.description && (
                  <span className="text-red-400 text-[10px] font-mono">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${tw.border.whiteSubtle}`}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={`px-4 py-2.5 ${tw.radius.button} text-xs font-mono text-[#83958d] hover:text-[#e8e1df] border border-white/10 hover:border-white/20 transition-colors uppercase tracking-wider font-bold cursor-pointer disabled:opacity-50`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 ${tw.radius.button} text-xs font-mono ${tw.bg.buttonPrimary} font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isSubmitting ? "SAVING..." : "SAVE CHANGES"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EditFeedbackModal;
