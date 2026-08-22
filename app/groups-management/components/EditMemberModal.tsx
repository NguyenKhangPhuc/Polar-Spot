"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { GroupMember } from "../../types/groups";
import { updateGroupMember } from "../../actions/group_members";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

interface EditMemberFormValues {
  name: string;
  email: string;
}

interface EditMemberModalProps {
  member: GroupMember | null;
  isOpen: boolean;
  onClose: () => void;
  onMemberUpdated: (updatedMemberRecord: GroupMember) => void;
}

export function EditMemberModal({
  member,
  isOpen,
  onClose,
  onMemberUpdated,
}: EditMemberModalProps) {
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMemberFormValues>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.member_name || "",
        email: member.member_email || "",
      });
    }
  }, [member, reset]);

  const onFormSubmit = async (formData: EditMemberFormValues) => {
    if (!member) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setIsOpenLoader(true);

    try {
      const { data: updatedMemberRecord, error } = await updateGroupMember(
        member.id,
        formData.name,
        formData.email
      );

      if (error || !updatedMemberRecord) {
        const errorMsg = error || "Fail to update group member";
        setSubmitError(errorMsg);
        showNotification(errorMsg);
        return;
      }

      showNotification("Group member updated successfully");
      onMemberUpdated(updatedMemberRecord);
      onClose();
    } catch {
      const errorMsg = "Fail to update group member";
      setSubmitError(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && member && (
        <div className="fixed inset-0 top-16 lg:top-0 lg:left-64 z-30 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-md bg-[#121212] border border-white/15 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 font-mono text-xs"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-sans">
                  EDIT GROUP MEMBER
                </h2>
                <p className="text-xs text-[#3be1fe] mt-0.5 truncate font-mono">
                  {member.member_name || member.member_email || "Member"}
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
              <div className="p-4 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold">
                [ERROR]: {submitError}
              </div>
            )}

            {/* Form using react-hook-form */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Field 1: User Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  MEMBER FULL NAME <span className="text-[#3be1fe]">*</span>
                </label>
                <input
                  {...register("name", {
                    required: "Member full name is required",
                  })}
                  type="text"
                  placeholder="e.g. John Doe"
                  className={`bg-[#050505] text-white border text-xs p-3.5 rounded-md w-full outline-none transition-colors ${
                    errors.name
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-[#3be1fe]/70"
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Field 2: User Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  MEMBER EMAIL ADDRESS <span className="text-[#3be1fe]">*</span>
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
                  className={`bg-[#050505] text-white border text-xs p-3.5 rounded-md w-full outline-none transition-colors ${
                    errors.email
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-white/15 focus:border-[#3be1fe]/70"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-400 font-medium mt-0.5">
                    {errors.email.message}
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

export default EditMemberModal;
