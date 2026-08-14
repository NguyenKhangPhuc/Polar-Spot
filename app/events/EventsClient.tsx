"use client";

/**
 * PURPOSE:
 * Orchestrator client component for the Events Explorer portal at app/events/EventsClient.tsx.
 * Renders a 2-column layout with a narrower sticky filter panel on the left (search, status filter, date sort)
 * and an event row card roster on the right, providing navigation links to detailed event pages (/events/[id]).
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/page.tsx' Server Component.
 *
 * INPUTS / PARAMETERS:
 * - events (Event[], Required): Array of event records fetched from the database.
 */

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";

interface EventsClientProps {
  events: Event[];
}

type SortOrder = "newest" | "oldest";

export default function EventsClient({ events }: EventsClientProps) {
  // Filter and Sort state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves public image URL for event posters. Returns direct URL if already formatted,
   * otherwise constructs Supabase public storage endpoint URL.
   *
   * PARAMETERS:
   * - posterPath (string | null | undefined): Raw image path stored in database.
   *
   * RETURNS:
   * - string | null: Fully qualified image URL string or null.
   */
  const getPosterUrl = (posterPath: string | null | undefined): string | null => {
    if (!posterPath) return null;
    if (
      posterPath.startsWith("http://") ||
      posterPath.startsWith("https://") ||
      posterPath.startsWith("/")
    ) {
      return posterPath;
    }
    return `http://127.0.0.1:54321/storage/v1/object/public/attachments/${posterPath}`;
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Memoized computation filtering events by title/description search query and status,
   * then sorting by created_at or start_date timestamp in ascending or descending order.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Event[]: Filtered and sorted event records.
   */
  const processedEvents = useMemo(() => {
    let result = [...events];

    // 1. Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          ((e as any).title && (e as any).title.toLowerCase().includes(q)) ||
          (e.short_description && e.short_description.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q))
      );
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    // 3. Date sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.start_date || 0).getTime();
      const dateB = new Date(b.created_at || b.start_date || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [events, searchQuery, statusFilter, sortOrder]);

  /**
   * BEHAVIORAL MECHANISM:
   * Resets all search, status, and sort filters back to default values.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleResetFilters = (): void => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative">
      {/* Header Section matching groups-management design */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Events Explorer
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
            UPCOMING &amp; PAST STARTUP PITCHING EVENTS IN OULU, FINLAND
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            {processedEvents.length} {processedEvents.length === 1 ? "EVENT" : "EVENTS"} FOUND
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid Layout: Filter Column (narrower) vs Events Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Narrower Filter Panel (lg:col-span-4) */}
        <aside className="lg:col-span-4 bg-[#13243b] border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 sticky top-6">
          <div className="flex items-center justify-between border-b border-white/12 pb-4">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>FILTER EVENTS</span>
            </h3>

            {(searchQuery || statusFilter !== "all" || sortOrder !== "newest") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors cursor-pointer"
              >
                RESET
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              SEARCH BY TITLE / LOCATION
            </label>
            <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
              <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search event name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs p-3 outline-none border-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              EVENT STATUS
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0a1526] border border-white/18 rounded-xl text-white text-xs p-3 outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
              <option value={EVENT_STATUS.FINISHED}>Finished</option>
            </select>
          </div>

          {/* Date Sorting */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              SORT BY DATE
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="w-full bg-[#0a1526] border border-white/18 rounded-xl text-white text-xs p-3 outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </aside>

        {/* Right Column: Events Roster (lg:col-span-8) */}
        <main className="lg:col-span-8 space-y-6">
          {processedEvents.length === 0 ? (
            <div className="bg-[#13243b] border border-white/20 rounded-2xl p-12 text-center space-y-3">
              <p className="text-base text-slate-300 font-semibold">
                No events found matching your active filter criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            processedEvents.map((event) => {
              const posterUrl = getPosterUrl(event.poster_path);
              const isOngoing = event.status === EVENT_STATUS.ONGOING;
              const eventTitle =
                (event as any).title ||
                event.short_description ||
                "POLAR BEAR PITCHING EVENT";

              return (
                <div
                  key={event.id}
                  className="bg-[#13243b] border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all flex flex-col md:flex-row gap-6 shadow-xl"
                >
                  {/* Event Poster Image */}
                  <div className="relative w-full md:w-56 h-48 rounded-xl overflow-hidden bg-[#0a1526] border border-white/18 shrink-0 flex items-center justify-center shadow-md">
                    {posterUrl ? (
                      <>
                        {/* Ambient Blurred Backdrop to fill empty frame space */}
                        <Image
                          src={posterUrl}
                          alt=""
                          fill
                          unoptimized
                          aria-hidden="true"
                          className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                        />
                        {/* Main Poster Image Maintaining Exact Original Aspect Ratio inside Frame */}
                        <Image
                          src={posterUrl}
                          alt={eventTitle}
                          fill
                          unoptimized
                          className="object-contain p-2 relative z-10"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-[#0a1526] to-sky-950 flex flex-col items-center justify-center p-4 text-center">
                        <svg className="w-10 h-10 text-cyan-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          NO POSTER
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Details Content */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                            isOngoing
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-800 text-slate-300 border-white/15"
                          }`}
                        >
                          {event.status || "STATUS_UNSET"}
                        </span>

                        {event.member_per_groups && (
                          <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            MAX {event.member_per_groups} MEMBERS / GROUP
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                        {eventTitle}
                      </h2>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}

                        {event.organized_date && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              Organized: {new Date(event.organized_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {(event.start_date || event.end_date) && (
                          <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-400">
                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {event.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}{" "}
                              - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: short_description at the very end with light/muted text color, and Navigation Button */}
                    <div className="space-y-4 pt-3 border-t border-white/10">
                      {event.short_description && (
                        <p className="text-xs text-slate-400/90 font-normal leading-relaxed line-clamp-3">
                          {event.short_description}
                        </p>
                      )}

                      <div className="flex justify-end">
                        <Link
                          href={`/events/${event.id}`}
                          className="px-6 py-3 rounded-xl bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
                        >
                          <span>VIEW EVENT DETAILS</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}
