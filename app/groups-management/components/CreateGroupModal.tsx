"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "../../types/event";
import { GroupWithMembersAndEvent } from "../../types/groups";
import { createGroup } from "../../actions/groups";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

/**
 * PURPOSE:
 * Pop-up modal dialog for creating a new pitching group. Uses an independent react-hook-form instance
 * to validate group_name, event_id, and short_description with global Loader and Notification feedback.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to encapsulate create group form state and modal UI.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - onClose (function, Required): Callback to close modal dialog.
 * - eventsList (Event[], Required): Array of events for event_id selection.
 * - onGroupCreated (function, Required): Callback invoked when a group is successfully created.
 */

interface CreateGroupFormValues {
  group_name: string;
  event_id: string;
  short_description: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventsList: Event[];
  onGroupCreated: (createdGroup: GroupWithMembersAndEvent) => void;
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
      event_id: eventsList[0]?.id || "",
      short_description: "",
    },
  });

  /**
   * BEHAVIORAL MECHANISM:
   * Submits form payload to createGroup server action.
   * Activates global loader backdrop, notifies user via toast, and updates parent state upon success.
   *
   * PARAMETERS:
   * - formData (CreateGroupFormValues): Validated form inputs.
   *
   * RETURNS:
   * - Promise<void>: Asynchronous submission.
   */
  const onFormSubmit = async (formData: CreateGroupFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsOpenLoader(true);

    try {
      const { data: createdGroup, error } = await createGroup({
        group_name: formData.group_name,
        event_id: formData.event_id,
        short_description: formData.short_description,
      });

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
        <div className="fixed inset-0 top-16 lg:top-0 lg:left-64 z-30 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-xl bg-[#13243b] border border-white/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/90 text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                CREATE NEW GROUP
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
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-sm font-semibold">
                [ERROR]: {submitError}
              </div>
            )}

            {/* Form using react-hook-form */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Field 1: Group Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  GROUP NAME <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("group_name", {
                    required: "Group name is required",
                  })}
                  type="text"
                  placeholder="e.g. Arctic Ice Pitchers"
                  className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${
                    errors.group_name
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-white/50"
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
                <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  TARGET EVENT <span className="text-red-400">*</span>
                </label>
                <select
                  {...register("event_id", {
                    required: "Please select an event for this group",
                  })}
                  className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors uppercase ${
                    errors.event_id
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-white/50"
                  }`}
                >
                  <option value="">-- SELECT TARGET EVENT --</option>
                  {eventsList.map((evt) => (
                    <option key={evt.id} value={evt.id}>
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
                <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  SHORT DESCRIPTION <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("short_description", {
                    required: "Group short description is required",
                  })}
                  rows={3}
                  placeholder="Describe the group's startup project, goals, or pitching category..."
                  className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors resize-none ${
                    errors.short_description
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-white/50"
                  }`}
                />
                {errors.short_description && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.short_description.message}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white border border-white/15 hover:bg-white/10 uppercase transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 uppercase transition-colors disabled:opacity-50 cursor-pointer"
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
