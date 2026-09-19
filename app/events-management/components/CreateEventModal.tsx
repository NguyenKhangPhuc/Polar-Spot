"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Event, EventInsert } from "../../types/event";
import { EVENT_STATUS } from "../../types/enum";
import { createEvent } from "../../actions/events";
import RichTextEditor from "../../components/RichTextEditor";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

interface CreateEventFormValues {
  title: string;
  short_description: string;
  status: EVENT_STATUS;
  member_per_groups: number;
  max_score?: number | null;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

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
      title: "",
      short_description: "",
      status: EVENT_STATUS.ONGOING,
      member_per_groups: 5,
      max_score: 100,
      location: "",
      start_date: "",
      end_date: "",
      organized_date: "",
      content: "",
    },
  });

  const onFormSubmit = async (formData: CreateEventFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsOpenLoader(true);

    const payload: EventInsert = {
      title: formData.title,
      short_description: formData.short_description,
      status: formData.status || EVENT_STATUS.ONGOING,
      member_per_groups: Number(formData.member_per_groups) || 5,
      max_score: formData.max_score ? Number(formData.max_score) : null,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      organized_date: formData.organized_date,
      content: formData.content,
    };

    try {
      const { data: createdEvent, error } = await createEvent(payload);

      if (error || !createdEvent) {
        const errorMsg = error || "Failed to create event. Please try again.";
        setSubmitError(errorMsg);
        showNotification(errorMsg);
        return;
      }

      showNotification("Event created successfully");
      reset();
      onEventCreated(createdEvent as Event);
      onClose();
    } catch {
      const errorMsg = "Failed to create event. Please try again.";
      setSubmitError(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsOpenLoader(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative my-auto w-full max-w-7xl bg-[#1d1b1a] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto text-[#e8e1df]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-black text-[#e8e1df] uppercase tracking-tight font-sans">
                  CREATE NEW EVENT
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
              <div className="p-4 rounded-sm bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono font-semibold">
                [ERROR]: {submitError}
              </div>
            )}

            {/* Form using react-hook-form in 2 Columns */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column (lg:col-span-5): Title, Short Description Textarea & Logistics */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Field 1: Event Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                      EVENT TITLE <span className="text-[#00ffec]">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: "Event title is required",
                      })}
                      type="text"
                      placeholder="e.g. Polar Bear Pitching Main Stage 2026"
                      className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                        errors.title
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-white/10 focus:border-[#00ffec]/60"
                      }`}
                    />
                    {errors.title && (
                      <span className="text-xs text-red-400 font-medium mt-0.5">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  {/* Field 2: Short Description Textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                      SHORT DESCRIPTION SUMMARY <span className="text-[#00ffec]">*</span>
                    </label>
                    <textarea
                      {...register("short_description", {
                        required: "Short description is required",
                      })}
                      rows={3}
                      placeholder="Brief overview summary displayed on cards..."
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

                  {/* Logistics Row 1: Status Select & Member Limit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        INITIAL STATUS <span className="text-[#00ffec]">*</span>
                      </label>
                      <select
                        {...register("status")}
                        className="bg-[#151312] text-[#e8e1df] border border-white/10 text-xs p-3.5 rounded-sm w-full outline-none focus:border-[#00ffec]/60 transition-colors uppercase cursor-pointer"
                      >
                        {Object.entries(EVENT_STATUS).map(([key, val]) => (
                          <option key={key} value={val} className="bg-[#151312] text-[#e8e1df]">
                            {key.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Member Limit */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        MEMBERS / GROUP <span className="text-[#00ffec]">*</span>
                      </label>
                      <input
                        {...register("member_per_groups", {
                          required: "Capacity is required",
                          min: { value: 1, message: "Minimum 1 member" },
                        })}
                        type="number"
                        placeholder="5"
                        className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                          errors.member_per_groups
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/10 focus:border-[#00ffec]/60"
                        }`}
                      />
                      {errors.member_per_groups && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.member_per_groups.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Logistics Row 2: Location & Max Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        LOCATION / STAGE NODE <span className="text-[#00ffec]">*</span>
                      </label>
                      <input
                        {...register("location", {
                          required: "Location is required",
                        })}
                        type="text"
                        placeholder="e.g. Oulu Market Square Ice Hole, Finland"
                        className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                          errors.location
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/10 focus:border-[#00ffec]/60"
                        }`}
                      />
                      {errors.location && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.location.message}
                        </span>
                      )}
                    </div>

                    {/* Max Score Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        MAX SCORE <span className="text-[#00ffec]">*</span>
                      </label>
                      <input
                        {...register("max_score", {
                          required: "Max score is required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Minimum 1" },
                        })}
                        type="number"
                        placeholder="100"
                        className={`bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                          errors.max_score
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/10 focus:border-[#00ffec]/60"
                        }`}
                      />
                      {errors.max_score && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.max_score.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dates Grid: Start & End Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        START DATE <span className="text-[#00ffec]">*</span>
                      </label>
                      <input
                        {...register("start_date", {
                          required: "Start date is required",
                        })}
                        type="date"
                        className={`bg-[#151312] text-[#e8e1df] border text-xs p-3 rounded-sm w-full outline-none transition-colors ${
                          errors.start_date
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/10 focus:border-[#00ffec]/60"
                        }`}
                      />
                      {errors.start_date && (
                        <span className="text-xs text-red-400 font-medium mt-0.5">
                          {errors.start_date.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                        END DATE <span className="text-[#00ffec]">*</span>
                      </label>
                      <input
                        {...register("end_date", {
                          required: "End date is required",
                        })}
                        type="date"
                        className={`bg-[#151312] text-[#e8e1df] border text-xs p-3 rounded-sm w-full outline-none transition-colors ${
                          errors.end_date
                            ? "border-red-500/70 focus:border-red-400"
                            : "border-white/10 focus:border-[#00ffec]/60"
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
                    <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                      ORGANIZED DATE &amp; TIME <span className="text-[#00ffec]">*</span>
                    </label>
                    <input
                      {...register("organized_date", {
                        required: "Organized date & time is required",
                      })}
                      type="datetime-local"
                      className={`bg-[#151312] text-[#e8e1df] border text-xs p-3.5 rounded-sm w-full outline-none transition-colors ${
                        errors.organized_date
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-white/10 focus:border-[#00ffec]/60"
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
                  <label className="text-[11px] font-bold text-[#83958d] uppercase tracking-wider">
                    EVENT CONTENT (RICH TEXT DETAILS) <span className="text-[#00ffec]">*</span>
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
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-sm text-xs font-mono font-bold text-[#83958d] hover:text-[#e8e1df] border border-white/10 hover:border-white/20 uppercase transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-sm text-xs font-mono font-bold text-[#00382b] bg-[#00ffec] hover:bg-[#00e6d4] uppercase transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? "CREATING..." : "CONFIRM & CREATE"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default CreateEventModal;
