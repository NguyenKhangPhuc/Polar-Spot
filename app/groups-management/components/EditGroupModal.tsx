"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "../../types/event";
import { GroupWithMembersAndEvent } from "../../types/groups";
import { updateGroup } from "../../actions/groups";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

interface EditGroupFormValues {
  group_name: string;
  event_id: string;
  short_description: string;
}

interface EditGroupModalProps {
  group: GroupWithMembersAndEvent | null;
  isOpen: boolean;
  onClose: () => void;
  eventsList: Event[];
  onGroupUpdated: (updatedGroup: GroupWithMembersAndEvent) => void;
}

export function EditGroupModal({
  group,
  isOpen,
  onClose,
  eventsList,
  onGroupUpdated,
}: EditGroupModalProps) {
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditGroupFormValues>();

  useEffect(() => {
    if (group) {
      reset({
        group_name: group.group_name || "",
        event_id: group.event_id || eventsList[0]?.id || "",
        short_description: group.short_description || "",
      });
    }
  }, [group, reset, eventsList]);

  const onFormSubmit = async (formData: EditGroupFormValues) => {
    if (!group) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setIsOpenLoader(true);

    try {
      const { data: updatedData, error } = await updateGroup({
        id: group.id,
        group_name: formData.group_name,
        event_id: formData.event_id,
        short_description: formData.short_description,
      });

      if (error || !updatedData) {
        const errorMsg = error || "Fail to update group";
        setSubmitError(errorMsg);
        showNotification(errorMsg);
        return;
      }

      const matchedEvent = eventsList.find((e) => e.id === formData.event_id);
      const enrichedGroup: GroupWithMembersAndEvent = {
        ...group,
        group_name: formData.group_name,
        event_id: formData.event_id,
        short_description: formData.short_description,
        events: matchedEvent
          ? {
              id: matchedEvent.id,
              short_description: matchedEvent.short_description,
              location: matchedEvent.location,
            }
          : group.events,
      };

      showNotification("Group updated successfully");
      onGroupUpdated(enrichedGroup);
      onClose();
    } catch {
      const errorMsg = "Fail to update group";
      setSubmitError(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && group && (
        <div className="fixed inset-0 top-16 lg:top-0 lg:left-64 z-30 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-xl bg-[#121212] border border-white/15 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 font-mono text-xs"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                EDIT GROUP DETAILS
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Submission Error Banner */}
            {submitError && (
              <div className="p-4 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold">
                [ERROR]: {submitError}
              </div>
            )}

            {/* Form using react-hook-form */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Field 1: Group Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  GROUP NAME <span className="text-[#3be1fe]">*</span>
                </label>
                <input
                  {...register("group_name", {
                    required: "Group name is required",
                  })}
                  type="text"
                  placeholder="e.g. Arctic Ice Pitchers"
                  className={`bg-[#050505] text-white border text-xs p-3.5 rounded-md w-full outline-none transition-colors ${
                    errors.group_name
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-[#3be1fe]/70"
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
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  TARGET EVENT <span className="text-[#3be1fe]">*</span>
                </label>
                <select
                  {...register("event_id", {
                    required: "Please select an event for this group",
                  })}
                  className={`bg-[#050505] text-white border text-xs p-3.5 rounded-md w-full outline-none transition-colors uppercase ${
                    errors.event_id
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-[#3be1fe]/70"
                  }`}
                >
                  <option value="" className="bg-[#050505] text-slate-400">-- SELECT TARGET EVENT --</option>
                  {eventsList.map((evt) => (
                    <option key={evt.id} value={evt.id} className="bg-[#050505] text-white">
                      {evt.short_description || evt.location || evt.id}
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
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  SHORT DESCRIPTION <span className="text-[#3be1fe]">*</span>
                </label>
                <textarea
                  {...register("short_description", {
                    required: "Group short description is required",
                  })}
                  rows={3}
                  placeholder="Describe the group's startup project, goals, or pitching category..."
                  className={`bg-[#050505] text-white border text-xs p-3.5 rounded-md w-full outline-none transition-colors resize-none ${
                    errors.short_description
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-[#3be1fe]/70"
                  }`}
                />
                {errors.short_description && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.short_description.message}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/12">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-md text-xs font-bold text-slate-300 hover:text-white border border-white/15 hover:bg-white/10 uppercase transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-md text-xs font-bold text-black bg-[#3be1fe] hover:bg-[#6ee7fc] uppercase transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EditGroupModal;
