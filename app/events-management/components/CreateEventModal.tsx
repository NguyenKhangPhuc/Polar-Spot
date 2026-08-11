"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Event, EventInsert } from "../../types/event";
import { EVENT_STATUS } from "../../types/enum";
import { createEvent } from "../../actions/events";
import RichTextEditor from "../../components/RichTextEditor";

/**
 * PURPOSE:
 * 2-column pop-up modal component for creating a new event record. Utilizes React Hook Form for client-side
 * input validation and Plate RichTextEditor for event content.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events-management/EventsManagementClient.tsx to isolate form submission, validation rules, and modal dialog UI.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - onClose (function, Required): Callback triggered to close the modal dialog.
 * - onEventCreated (function, Required): Callback invoked when an event is successfully created.
 */

interface CreateEventFormValues {
  short_description: string;
  status: EVENT_STATUS;
  member_per_groups: number;
  location: string;
  start_date: string;
  end_date: string;
  organized_date: string;
  content: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: Event) => void;
}

export function CreateEventModal({
  isOpen,
  onClose,
  onEventCreated,
}: CreateEventModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    defaultValues: {
      short_description: "",
      status: EVENT_STATUS.ONGOING,
      member_per_groups: 5,
      location: "",
      start_date: "",
      end_date: "",
      organized_date: "",
      content: "",
    },
  });

  /**
   * BEHAVIORAL MECHANISM:
   * Validates form fields, submits payload to createEvent server action, and updates parent state upon success.
   *
   * PARAMETERS:
   * - formData (CreateEventFormValues): Validated form data payload.
   *
   * RETURNS:
   * - Promise<void>: Asynchronous submission handler.
   */
  const onFormSubmit = async (formData: CreateEventFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload: EventInsert = {
      short_description: formData.short_description,
      status: formData.status || EVENT_STATUS.ONGOING,
      member_per_groups: Number(formData.member_per_groups) || 5,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      organized_date: formData.organized_date,
      content: formData.content,
    };

    const { data: createdEvent, error } = await createEvent(payload);

    setIsSubmitting(false);

    if (error || !createdEvent) {
      setSubmitError(error || "Failed to create event. Please try again.");
      return;
    }

    reset();
    onEventCreated(createdEvent as Event);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 top-16 lg:top-0 lg:left-64 z-30 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-7xl bg-[#13243b] border border-white/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/90 max-h-[85vh] overflow-y-auto text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                CREATE NEW EVENT
              </h2>
              <button
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

            {/* Form using react-hook-form in 2 Columns */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column (lg:col-span-5): Metadata & Short Description Textarea */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Field 1: Short Description (Textarea) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      SHORT DESCRIPTION / EVENT TITLE <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...register("short_description", {
                        required: "Short description / event title is required",
                      })}
                      rows={3}
                      placeholder="e.g. Polar Bear Pitching Main Stage 2026"
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

                  {/* Status & Max Members */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                        EVENT STATUS <span className="text-red-400">*</span>
                      </label>
                      <select
                        {...register("status", {
                          required: "Event status is required",
                        })}
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors uppercase ${
                          errors.status
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/15 focus:border-white/50"
                        }`}
                      >
                        {Object.entries(EVENT_STATUS).map(([key, val]) => (
                          <option key={key} value={val}>
                            {key.toUpperCase()} ({val})
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.status.message}
                        </span>
                      )}
                    </div>

                    {/* Max Members Per Group */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                        MEMBERS / GROUP <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register("member_per_groups", {
                          required: "Members per group is required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Minimum 1 member required" },
                        })}
                        type="number"
                        placeholder="e.g. 5"
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${
                          errors.member_per_groups
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/15 focus:border-white/50"
                        }`}
                      />
                      {errors.member_per_groups && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.member_per_groups.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      LOCATION <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("location", {
                        required: "Event location is required",
                      })}
                      type="text"
                      placeholder="e.g. Oulu Harbor Ice-Hole Stage, Finland"
                      className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${
                        errors.location
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-white/15 focus:border-white/50"
                      }`}
                    />
                    {errors.location && (
                      <span className="text-xs text-red-400 font-medium mt-0.5">
                        {errors.location.message}
                      </span>
                    )}
                  </div>

                  {/* Start Date & End Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                        START DATE <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register("start_date", {
                          required: "Start date is required",
                        })}
                        type="date"
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3 rounded-xl w-full outline-none transition-colors ${
                          errors.start_date
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/15 focus:border-white/50"
                        }`}
                      />
                      {errors.start_date && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.start_date.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                        END DATE <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register("end_date", {
                          required: "End date is required",
                        })}
                        type="date"
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3 rounded-xl w-full outline-none transition-colors ${
                          errors.end_date
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/15 focus:border-white/50"
                        }`}
                      />
                      {errors.end_date && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.end_date.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Organized Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      ORGANIZED DATE &amp; TIME <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("organized_date", {
                        required: "Organized date & time is required",
                      })}
                      type="datetime-local"
                      className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${
                        errors.organized_date
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-white/15 focus:border-white/50"
                      }`}
                    />
                    {errors.organized_date && (
                      <span className="text-xs text-red-400 font-medium mt-0.5">
                        {errors.organized_date.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Column (lg:col-span-7): Plate Rich Text Editor for Content */}
                <div className="lg:col-span-7 flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    EVENT CONTENT (RICH TEXT DETAILS) <span className="text-red-400">*</span>
                  </label>
                  <Controller
                    name="content"
                    control={control}
                    rules={{
                      required: "Event content is required",
                      validate: (val) =>
                        (val && val.trim().length > 0) || "Event content cannot be empty",
                    }}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Write detailed event description, schedule rules, guidelines..."
                        className={`min-h-[360px] ${
                          errors.content ? "border-red-500/70" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.content && (
                    <span className="text-xs text-red-400 font-medium mt-0.5">
                      {errors.content.message}
                    </span>
                  )}
                </div>

              </div>

              {/* Form Action Buttons */}
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

export default CreateEventModal;
