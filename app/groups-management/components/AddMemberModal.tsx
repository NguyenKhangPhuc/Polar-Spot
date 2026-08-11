"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { GroupWithMembersAndEvent, GroupMemberWithProfile } from "../../types/groups";
import { addGroupMemberByEmail } from "../../actions/group_members";

/**
 * PURPOSE:
 * Pop-up modal dialog for adding a new member to a group by looking up their profile email address. Uses react-hook-form.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to encapsulate member assignment logic.
 *
 * INPUTS / PARAMETERS:
 * - group (GroupWithMembersAndEvent | null, Required): Target group to add a member to.
 * - isOpen (boolean, Required): Controls modal visibility.
 * - onClose (function, Required): Callback to close modal dialog.
 * - onMemberAdded (function, Required): Callback invoked when a new member record is successfully created.
 */

interface AddMemberFormValues {
  email: string;
}

interface AddMemberModalProps {
  group: GroupWithMembersAndEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: (groupId: string, newMemberRecord: GroupMemberWithProfile) => void;
}

export function AddMemberModal({
  group,
  isOpen,
  onClose,
  onMemberAdded,
}: AddMemberModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    defaultValues: {
      email: "",
    },
  });

  /**
   * BEHAVIORAL MECHANISM:
   * Calls addGroupMemberByEmail server action. If user profile exists and is not already a member,
   * creates group_members entry and updates parent state.
   *
   * PARAMETERS:
   * - formData (AddMemberFormValues): Form data containing user email string.
   *
   * RETURNS:
   * - Promise<void>: Asynchronous member addition.
   */
  const onFormSubmit = async (formData: AddMemberFormValues) => {
    if (!group) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const { data: newMemberRecord, error } = await addGroupMemberByEmail(
      group.id,
      formData.email
    );

    setIsSubmitting(false);

    if (error || !newMemberRecord) {
      setSubmitError(error || "Fail to add member to group");
      return;
    }

    reset();
    onMemberAdded(group.id, newMemberRecord as GroupMemberWithProfile);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && group && (
        <div className="fixed inset-0 top-16 lg:top-0 lg:left-64 z-30 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-md bg-[#13243b] border border-white/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/90 text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  ADD MEMBER TO GROUP
                </h2>
                <p className="text-xs text-sky-200 mt-0.5 truncate font-medium">
                  {group.group_name}
                </p>
              </div>
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
              {/* Field: User Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  MEMBER EMAIL ADDRESS <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "User email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address format",
                    },
                  })}
                  type="email"
                  placeholder="e.g. member@businessoulu.fi"
                  className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${
                    errors.email
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-white/50"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.email.message}
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
                  {isSubmitting ? "ADDING..." : "ADD MEMBER"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddMemberModal;
