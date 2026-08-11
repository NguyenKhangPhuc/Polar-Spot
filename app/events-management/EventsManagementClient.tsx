"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event, EventInsert } from "../types/event";
import { EVENT_STATUS } from "../types/enum";
import { createEvent } from "../actions/events";

type SortOrder = "asc" | "desc";

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

  // React Hook Form for Creating Event
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventInsert>({
    defaultValues: {
      status: EVENT_STATUS.ONGOING,
      member_per_groups: 5,
    },
  });

  // Filter & Sort Logic
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...eventsList];

    // 1. Search filter by title / description / location
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (event) =>
          (event.short_description &&
            event.short_description.toLowerCase().includes(q)) ||
          (event.content && event.content.toLowerCase().includes(q)) ||
          (event.location && event.location.toLowerCase().includes(q))
      );
    }

    // 2. Status filter
    if (statusFilter) {
      result = result.filter((event) => event.status === statusFilter);
    }

    // 3. Sorting (by short_description or created_at)
    result.sort((a, b) => {
      const titleA = (a.short_description || a.content || "").toLowerCase();
      const titleB = (b.short_description || b.content || "").toLowerCase();
      if (sortBy === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    return result;
  }, [eventsList, searchQuery, statusFilter, sortBy]);

  // Handle Form Submission
  const onFormSubmit = async (formData: EventInsert) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const { data: createdEvent, error } = await createEvent({
      ...formData,
      status: formData.status || EVENT_STATUS.ONGOING,
      member_per_groups: Number(formData.member_per_groups) || 5,
    });

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
          onClick={() => {
            setSubmitError(null);
            setIsModalOpen(true);
          }}
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
                      {event.short_description || event.content || "UNTITLED_EVENT"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 sm:p-5 text-center w-36">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          event.status === EVENT_STATUS.ONGOING
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
                      {event.location || "NOT_SPECIFIED"}
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

      {/* Pop-Up Modal for Creating New Event */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13243b] border border-white/25 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto text-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  CREATE NEW EVENT
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Submission Error Banner */}
              {submitError && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-sm">
                  [ERROR]: {submitError}
                </div>
              )}

              {/* Form using react-hook-form with EventInsert */}
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Field 1: Event Title / Short Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    EVENT TITLE / SHORT DESCRIPTION
                  </label>
                  <input
                    {...register("short_description", {
                      required: "Event title is required",
                    })}
                    type="text"
                    placeholder="e.g. Polar Bear Pitching Main Stage 2026"
                    className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                  />
                  {errors.short_description && (
                    <span className="text-xs text-red-400 font-medium mt-1">
                      {errors.short_description.message}
                    </span>
                  )}
                </div>

                {/* Field 2 & 3 Grid: Status & Max Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      EVENT STATUS
                    </label>
                    <select
                      {...register("status", {
                        required: "Status is required",
                      })}
                      className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors uppercase"
                    >
                      {Object.entries(EVENT_STATUS).map(([key, val]) => (
                        <option key={key} value={val}>
                          {key.toUpperCase()} ({val})
                        </option>
                      ))}
                    </select>
                    {errors.status && (
                      <span className="text-xs text-red-400 font-medium mt-1">
                        {errors.status.message}
                      </span>
                    )}
                  </div>

                  {/* Max Members Per Group */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      MEMBERS PER GROUP
                    </label>
                    <input
                      {...register("member_per_groups", {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum 1 member" },
                      })}
                      type="number"
                      placeholder="e.g. 5"
                      className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                    />
                    {errors.member_per_groups && (
                      <span className="text-xs text-red-400 font-medium mt-1">
                        {errors.member_per_groups.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 4: Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    EVENT LOCATION
                  </label>
                  <input
                    {...register("location")}
                    type="text"
                    placeholder="e.g. Oulu Harbor Ice-Hole Stage, Finland"
                    className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                  />
                </div>

                {/* Field 5 & 6 Grid: Start Date & End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      START DATE &amp; TIME
                    </label>
                    <input
                      {...register("start_date")}
                      type="datetime-local"
                      className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                      END DATE &amp; TIME
                    </label>
                    <input
                      {...register("end_date")}
                      type="datetime-local"
                      className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Field 7: Organized Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    ORGANIZED DATE
                  </label>
                  <input
                    {...register("organized_date")}
                    type="date"
                    className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors"
                  />
                </div>

                {/* Field 8: Content / Details */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    EVENT CONTENT / DETAILS
                  </label>
                  <textarea
                    {...register("content")}
                    rows={3}
                    placeholder="Full event description, schedule rules, pitching guidelines..."
                    className="bg-[#0a1526] text-white border border-white/15 text-sm sm:text-base p-3.5 rounded-xl w-full outline-none focus:border-white/50 transition-colors resize-none"
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white border border-white/15 hover:bg-white/10 uppercase transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 uppercase transition-colors disabled:opacity-50"
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
