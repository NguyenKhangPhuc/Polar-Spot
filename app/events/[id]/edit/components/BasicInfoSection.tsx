"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Event, EventInsert } from "@/app/types/event";
import { updateEvent } from "@/app/actions/events";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import RichTextEditor from "@/app/components/RichTextEditor";

/**
 * PURPOSE:
 * Basic event information configuration panel component. Renders form fields for title, short description textarea,
 * max group members, location node, temporal dates, organized timestamp, and rich specification editor.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent of app/events/[id]/edit/EditEventClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Preloaded event record to extract default values.
 * - page (string, Required): Active navigation tab view state.
 */

interface BasicInfoFormValues {
  title: string;
  short_description: string;
  member_per_groups: number;
  max_score?: number | null;
  location: string;
  start_date: string;
  end_date: string;
  organized_date: string;
  content: string;
}

interface BasicInfoSectionProps {
  event: Event;
  page: string;
}

export default function BasicInfoSection({ event, page }: BasicInfoSectionProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BasicInfoFormValues>({
    defaultValues: {
      title: (event as any).title || "",
      short_description: event.short_description || "",
      member_per_groups: event.member_per_groups || 5,
      max_score: event.max_score ?? 100,
      location: event.location || "",
      start_date: event.start_date ? event.start_date.split("T")[0] : "",
      end_date: event.end_date ? event.end_date.split("T")[0] : "",
      organized_date: event.organized_date
        ? new Date(event.organized_date).toISOString().slice(0, 16)
        : "",
      content: typeof event.content === "string" ? event.content : JSON.stringify(event.content || ""),
    },
  });

  /**
   * BEHAVIORAL MECHANISM:
   * Submits updated basic information payload to updateEvent server action.
   * Formats organized date, displays global backdrop loader, and shows toast notification.
   *
   * PARAMETERS:
   * - formData (BasicInfoFormValues): Form values payload.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateEventInfo = async (formData: BasicInfoFormValues): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const formattedDate = formData.organized_date
        ? new Date(formData.organized_date).toISOString()
        : null;

      const updatedPayload: EventInsert = {
        id: event.id,
        title: formData.title,
        short_description: formData.short_description,
        member_per_groups: Number(formData.member_per_groups) || 5,
        max_score: formData.max_score ? Number(formData.max_score) : null,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        organized_date: formattedDate,
        content: formData.content,
      };

      const { error } = await updateEvent(updatedPayload);
      if (error) {
        throw new Error(error);
      }
      showNotification("Update event successfully");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      } else {
        showNotification("Failed to update event basic info.");
      }
    } finally {
      setIsOpenLoader(false);
    }
  };

  if (page !== "basic") {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(handleUpdateEventInfo)} className="w-full flex flex-col gap-8 select-text font-mono">
      
      {/* SECTION 1: CORE IDENTITY */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
          <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider flex items-center gap-2 font-mono">
            <span className="w-[3px] h-3 bg-[#00ffec]" />
            CORE IDENTITY &amp; CAPACITY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Event Title */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              EVENT TITLE <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. POLAR BEAR PITCHING MAIN STAGE 2026"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors placeholder:text-[#83958d]/40 ${
                errors.title
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("title", { required: "Event title is required" })}
            />
            {errors.title && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Short Description Textarea */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              SHORT DESCRIPTION <span className="text-[#00ffec]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Write a brief overview of the pitching event..."
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors resize-none placeholder:text-[#83958d]/40 ${
                errors.short_description
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("short_description", { required: "Short description is required" })}
            />
            {errors.short_description && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.short_description.message}
              </span>
            )}
          </div>

          {/* Max Group Members */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              MEMBERS PER GROUP <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors placeholder:text-[#83958d]/40 ${
                errors.member_per_groups
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("member_per_groups", {
                required: "Members per group is required",
                valueAsNumber: true,
                min: { value: 1, message: "Min 1 member" },
              })}
            />
            {errors.member_per_groups && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.member_per_groups.message}
              </span>
            )}
          </div>

          {/* Max Score */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              MAX SCORE <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="100"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors placeholder:text-[#83958d]/40 ${
                errors.max_score
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("max_score", {
                required: "Max score is required",
                valueAsNumber: true,
                min: { value: 1, message: "Min score is 1" },
              })}
            />
            {errors.max_score && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.max_score.message}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              LOCATION / NODE <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Oulu Harbor Ice-Hole Stage, Finland"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors placeholder:text-[#83958d]/40 ${
                errors.location
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TEMPORAL LOGISTICS */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
          <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider flex items-center gap-2 font-mono">
            <span className="w-[3px] h-3 bg-[#00ffec]" />
            TEMPORAL LOGISTICS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              START DATE <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="date"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors ${
                errors.start_date
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.start_date.message}
              </span>
            )}
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              END DATE <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="date"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors ${
                errors.end_date
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("end_date", { required: "End date is required" })}
            />
            {errors.end_date && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.end_date.message}
              </span>
            )}
          </div>

          {/* Organized DateTime */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              ORGANIZATION TIMESTAMP (DATE &amp; TIME) <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="datetime-local"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors ${
                errors.organized_date
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("organized_date", { required: "Organized Date & Time is required" })}
            />
            {errors.organized_date && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.organized_date.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: RICH TEXT SPECIFICATION */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
          <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider flex items-center gap-2 font-mono">
            <span className="w-[3px] h-3 bg-[#00ffec]" />
            FULL SPECIFICATION (RICH TEXT DETAILS) <span className="text-[#00ffec]">*</span>
          </span>
        </div>

        <Controller
          name="content"
          control={control}
          rules={{
            required: "Event content is required",
          }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Write detailed event specification, rules, schedule..."
              className={`min-h-[360px] ${errors.content ? "border-red-500/70" : ""}`}
            />
          )}
        />
        {errors.content && (
          <span className="text-[10px] text-red-400 font-mono">
            {errors.content.message}
          </span>
        )}
      </div>

      {/* Save Action Block */}
      <div className="flex justify-end select-none">
        <button
          type="submit"
          className="px-6 py-3 bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer flex items-center gap-2 shadow-md shadow-[#00ffec]/20 font-mono"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>SAVE CHANGES</span>
        </button>
      </div>

    </form>
  );
}
