"use client";

/**
 * PURPOSE:
 * Orchestrator client component for the Events Explorer portal.
 * Manages state for real-time text search, status filtering, and date sorting.
 * Delegates rendering to modular subcomponents (HeaderSection, EventFilterControls, EventList).
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/page.tsx' Server Component.
 *
 * INPUTS / PARAMETERS:
 * - events (Event[], Required): Array of event records fetched from the database.
 */

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";
import HeaderSection from "./HeaderSection";
import EventFilterControls from "./EventFilterControls";
import EventList from "./EventList";

interface EventsClientProps {
  events: Event[];
}

type SortOrder = "newest" | "oldest";

export function EventsClient({ events }: EventsClientProps) {
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
      {/* Header Section */}
      <HeaderSection totalFound={processedEvents.length} />

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Filter Panel (lg:col-span-4) */}
        <EventFilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onResetFilters={handleResetFilters}
        />

        {/* Right Column: Events Roster (lg:col-span-8) */}
        <main className="lg:col-span-8">
          <EventList
            events={processedEvents}
            getPosterUrl={getPosterUrl}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </div>
  );
}

export default EventsClient;
