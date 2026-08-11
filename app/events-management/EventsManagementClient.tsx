"use client";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event, EventInsert } from "../types/event";
import { EVENT_STATUS } from "../types/enum";
import { createEvent } from "../actions/events";
import RichTextEditor from "../components/RichTextEditor";

type SortOrder = "asc" | "desc";

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

interface EventsManagementClientProps {
  initialEvents: Event[];
}

export default function EventsManagementClient({
  initialEvents,
}: EventsManagementClientProps) {
  const router = useRouter();

  // Local state
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EVENT_STATUS | "">("");
  const [sortBy, setSortBy] = useState<SortOrder>("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form for Creating Event with strict required rules
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

  // Filter & Sort Logic
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...eventsList];

    // 1. Search filter by title / description / location
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((event) => {
        const desc = typeof event.short_description === "string" ? event.short_description : "";
        const cnt = typeof event.content === "string" ? event.content : "";
        const loc = typeof event.location === "string" ? event.location : "";
        return (
          desc.toLowerCase().includes(q) ||
          cnt.toLowerCase().includes(q) ||
          loc.toLowerCase().includes(q)
        );
      });
    }

    // 2. Status filter
    if (statusFilter) {
      result = result.filter((event) => event.status === statusFilter);
    }

    // 3. Sorting (by short_description or created_at)
    result.sort((a, b) => {
      const descA = typeof a.short_description === "string" ? a.short_description : "";
      const descB = typeof b.short_description === "string" ? b.short_description : "";
      if (sortBy === "asc") {
        return descA.localeCompare(descB);
      } else {
        return descB.localeCompare(descA);
      }
    });

    return result;
  }, [eventsList, searchQuery, statusFilter, sortBy]);

  // Handle Form Submission
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

    // Update local list & close modal
    setEventsList((prev) => [createdEvent as Event, ...prev]);
    reset();
    setIsModalOpen(false);
    router.refresh();
  };

  const handleOpenModal = () => {
    setSubmitError(null);
    reset({
      short_description: "",
      status: EVENT_STATUS.ONGOING,
      member_per_groups: 5,
      location: "",
      start_date: "",
      end_date: "",
      organized_date: "",
      content: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Events Management
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
            REGISTRY &amp; CONTROL PANEL FOR POLAR BEAR PITCHING EVENTS
          </p>
        </div>

        {/* Create Event Trigger Button */}
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 transition-colors shadow-lg shadow-white/10 uppercase tracking-wider shrink-0 cursor-pointer"
        >
          <span>+ CREATE NEW EVENT</span>
        </button>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        {/* Search Input */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
            SEARCH EVENT NAME / TITLE
          </label>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              autoComplete="off"
              placeholder="Search by event title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-white/50 transition-colors w-full"
            />
            <svg
              className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* Status Filter */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
              FILTER BY STATUS
            </label>
            <div className="relative flex items-center w-full">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as EVENT_STATUS | "")
                }
                className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 pr-10 rounded-xl outline-none focus:border-white/50 transition-colors w-full appearance-none cursor-pointer uppercase"
              >
                <option value="">ALL STATUSES</option>
                {Object.entries(EVENT_STATUS).map(([key, val]) => (
                  <option key={key} value={val}>
                    {key.toUpperCase()} ({val})
                  </option>
                ))}
              </select>
              <svg
                className="w-5 h-5 absolute right-3 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Sort Order Select */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
              SORT (EVENT TITLE)
            </label>
            <div className="relative flex items-center w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 pr-10 rounded-xl outline-none focus:border-white/50 transition-colors w-full appearance-none cursor-pointer uppercase"
              >
                <option value="asc">A - Z (ASCENDING)</option>
                <option value="desc">Z - A (DESCENDING)</option>
              </select>
              <svg
                className="w-5 h-5 absolute right-3 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabular Display of Events */}
      <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full border-collapse text-sm text-slate-200 text-left min-w-[950px]">
          <thead>
            <tr className="border-b border-white/15 bg-[#0a1526] text-slate-300 select-none text-xs uppercase tracking-wider font-bold">
              <th className="p-4 sm:p-5 text-center w-14">NO</th>
              <th className="p-4 sm:p-5">EVENT_TITLE</th>
              <th className="p-4 sm:p-5 text-center w-36">STATUS</th>
              <th className="p-4 sm:p-5">START_DATE</th>
              <th className="p-4 sm:p-5">END_DATE</th>
              <th className="p-4 sm:p-5">ORGANIZED_DATE</th>
              <th className="p-4 sm:p-5">LOCATION</th>
              <th className="p-4 sm:p-5 text-center w-40">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {filteredAndSortedEvents.length > 0 ? (
                filteredAndSortedEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Index */}
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-400">
                      {String(index + 1).padStart(3, "0")}
                    </td>

                    {/* Event Title */}
                    <td className="p-4 sm:p-5 text-white font-bold text-base">
                      {typeof event.short_description === "string"
                        ? event.short_description
                        : typeof event.content === "string"
                          ? event.content
                          : "UNTITLED_EVENT"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 sm:p-5 text-center w-36">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${event.status === EVENT_STATUS.ONGOING
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-300 border border-slate-600/40"
                          }`}
                      >
                        {event.status || "N/A"}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.end_date
                        ? new Date(event.end_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.organized_date
                        ? new Date(event.organized_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>

                    {/* Location */}
                    <td className="p-4 sm:p-5 text-white max-w-[180px] truncate uppercase font-medium">
                      {typeof event.location === "string" ? event.location : "NOT_SPECIFIED"}
                    </td>

                    {/* Action Column: Edit Event */}
                    <td className="p-4 sm:p-5 text-center w-40">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="inline-block px-4 py-2 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/25 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        EDIT EVENT
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-16 text-center text-slate-400 select-none text-base"
                  >
                    NO EVENT REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pop-Up Modal for Creating New Event (2-Column Expanded Layout) */}
      <AnimatePresence>
        {isModalOpen && (
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
                  onClick={() => setIsModalOpen(false)}
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

              {/* Form using react-hook-form with CreateEventFormValues in 2 Columns */}
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
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors resize-none ${errors.short_description
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
                          className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors uppercase ${errors.status
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
                          className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${errors.member_per_groups
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
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${errors.location
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
                          className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3 rounded-xl w-full outline-none transition-colors ${errors.start_date
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
                          className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3 rounded-xl w-full outline-none transition-colors ${errors.end_date
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
                        className={`bg-[#0a1526] text-white border text-sm sm:text-base p-3.5 rounded-xl w-full outline-none transition-colors ${errors.organized_date
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
                          className={`min-h-[360px] ${errors.content ? "border-red-500/70" : ""
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
                    onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
