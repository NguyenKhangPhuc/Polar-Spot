"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "../../types/event";
import { GroupWithMembersAndEvent, GroupInsert } from "../../types/groups";
import { createGroup } from "../../actions/groups";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

interface CreateGroupFormValues {
  group_name: string;
  short_description: string;
  event_id: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventsList: Event[];
  onGroupCreated: (newGroup: GroupWithMembersAndEvent) => void;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  eventsList,
  onGroupCreated,
}: CreateGroupModalProps) {
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormValues>({
    defaultValues: {
      group_name: "",
      short_description: "",
      event_id: "",
    },
  });

  const onFormSubmit = async (formData: CreateGroupFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsOpenLoader(true);

    const payload: GroupInsert = {
      group_name: formData.group_name,
      short_description: formData.short_description,
      event_id: formData.event_id,
    };

    try {
      const { data: createdGroup, error } = await createGroup(payload);

      if (error || !createdGroup) {
        const errorMsg = error || "Fail to create group";
        setSubmitError(errorMsg);
        showNotification(errorMsg);
        return;
      }

      const matchedEvent = eventsList.find((e) => e.id === formData.event_id);
      const enrichedGroup: GroupWithMembersAndEvent = {
        ...(createdGroup as any),
        events: matchedEvent
          ? {
              id: matchedEvent.id,
              short_description: matchedEvent.short_description,
              location: matchedEvent.location,
            }
          : null,
        group_members: [],
      };

      showNotification("Group created successfully");
      reset();
      onGroupCreated(enrichedGroup);
      onClose();
    } catch {
      const errorMsg = "Fail to create group";
      setSubmitError(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-xl bg-[#1d1b1a] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl text-[#e8e1df] font-mono text-xs"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-black text-[#e8e1df] uppercase tracking-tight font-sans">
                  CREATE NEW GROUP
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#83958d] hover:text-[#e8e1df] p-1 cursor-pointer transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Submission Error Banner */}
            {submitError && (
              <div className="p-4 rounded-sm bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold">
                [ERROR]: {submitError}
              </div>
            )}

            {/* Form using react-hook-form */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Field 1: Group Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                  GROUP NAME <span className="text-[#00ffec]">*</span>
                </label>
                <input
                  {...register("group_name", {
                    required: "Group name is required",
                  })}
                  type="text"
                  placeholder="e.g. Arctic Ice Pitchers"
                  className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                    errors.group_name
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/10 focus:border-[#00ffec]/60"
                  }`}
                />
                {errors.group_name && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.group_name.message}
                  </span>
                )}
              </div>

              {/* Field 2: Target Event Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                  TARGET EVENT <span className="text-[#00ffec]">*</span>
                </label>
                <select
                  {...register("event_id", {
                    required: "Please select an event for this group",
                  })}
                  className={`bg-[#151312] text-[#e8e1df] border text-xs p-3.5 rounded-sm w-full outline-none transition-colors uppercase cursor-pointer ${
                    errors.event_id
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/10 focus:border-[#00ffec]/60"
                  }`}
                >
                  <option value="" className="bg-[#151312] text-[#83958d]">-- SELECT TARGET EVENT --</option>
                  {eventsList.map((evt) => (
                    <option key={evt.id} value={evt.id} className="bg-[#151312] text-[#e8e1df]">
                      {(evt as any).title || evt.short_description || evt.location || evt.id}
                    </option>
                  ))}
                </select>
                {errors.event_id && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.event_id.message}
                  </span>
                )}
              </div>

              {/* Field 3: Short Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                  SHORT DESCRIPTION <span className="text-[#00ffec]">*</span>
                </label>
                <textarea
                  {...register("short_description", {
                    required: "Group short description is required",
                  })}
                  rows={3}
                  placeholder="Describe the group's startup project, goals, or pitching category..."
                  className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors resize-none ${
                    errors.short_description
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/10 focus:border-[#00ffec]/60"
                  }`}
                />
                {errors.short_description && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.short_description.message}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-sm text-xs font-bold text-[#83958d] hover:text-[#e8e1df] border border-white/10 hover:border-white/20 uppercase transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-sm text-xs font-bold text-[#00382b] bg-[#00ffec] hover:bg-[#00e6d4] uppercase transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? "CREATING..." : "CONFIRM & CREATE"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CreateGroupModal;
