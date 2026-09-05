"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Event } from "@/app/types/event";
import HeaderSection from "./HeaderSection";
import EventFilterControls from "./EventFilterControls";
import EventList from "./EventList";
import Pagination from "@/components/Pagination";

interface EventsClientProps {
  events: Event[];
}

type SortBy = "newest" | "oldest" | "title_asc" | "title_desc";

/**
 * PURPOSE:
 * Primary client-side controller for the Polar-Spot Events Explorer portal.
 * Orchestrates ITEE SPOT 12-column layout (3-col filter sidebar + 9-col results grid),
 * single status filtering (no registration status), schedule range filtering, search,
 * sorting, and pagination.
 */
export function EventsClient({ events }: EventsClientProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("all");

  // Sorting State
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  /**
   * Generates public asset URL for event poster image.
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
   * Toggles status checkboxes inside filter sidebar.
   */
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1);
  };

  /**
   * Resets all search and filter parameters.
   */
  const handleResetFilters = (): void => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedSchedule("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const isFilterActive =
    searchQuery.trim() !== "" ||
    selectedStatuses.length > 0 ||
    selectedSchedule !== "all" ||
    sortBy !== "newest";

  // Filtered and Sorted Events
  const processedEvents = useMemo(() => {
    let result = events.filter((event) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          (event as any).title && (event as any).title.toLowerCase().includes(q);
        const matchesDesc =
          event.short_description && event.short_description.toLowerCase().includes(q);
        const matchesLocation =
          event.location && event.location.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesLocation) {
          return false;
        }
      }

      // 2. Single Status Filter (NO registration status)
      if (selectedStatuses.length > 0) {
        const eventStatus = (event.status || "").toLowerCase();
        if (!selectedStatuses.includes(eventStatus)) {
          return false;
        }
      }

      // 3. Schedule Filter (Date matching)
      if (selectedSchedule !== "all") {
        const rawDate = event.start_date || event.organized_date;
        if (rawDate) {
          const startDate = new Date(rawDate);
          const now = new Date();

          // Calculate start of current week (Monday)
          const startOfWeek = new Date(now);
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          startOfWeek.setHours(0, 0, 0, 0);

          // Calculate end of current week (Sunday)
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          // Calculate start and end of current month
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );

          if (selectedSchedule === "week") {
            if (startDate < startOfWeek || startDate > endOfWeek) return false;
          } else if (selectedSchedule === "month") {
            if (startDate < startOfMonth || startDate > endOfMonth) return false;
          } else if (selectedSchedule === "past") {
            if (startDate >= now) return false;
          } else if (selectedSchedule === "upcoming") {
            if (startDate < now) return false;
          }
        }
      }

      return true;
    });

    // Apply Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.start_date || a.organized_date || a.created_at || 0).getTime();
        const dateB = new Date(b.start_date || b.organized_date || b.created_at || 0).getTime();
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        const dateA = new Date(a.start_date || a.organized_date || a.created_at || 0).getTime();
        const dateB = new Date(b.start_date || b.organized_date || b.created_at || 0).getTime();
        return dateA - dateB;
      } else if (sortBy === "title_asc") {
        const titleA = ((a as any).title || a.short_description || "").toLowerCase();
        const titleB = ((b as any).title || b.short_description || "").toLowerCase();
        return titleA.localeCompare(titleB);
      } else if (sortBy === "title_desc") {
        const titleA = ((a as any).title || a.short_description || "").toLowerCase();
        const titleB = ((b as any).title || b.short_description || "").toLowerCase();
        return titleB.localeCompare(titleA);
      }
      return 0;
    });

    return result;
  }, [events, searchQuery, selectedStatuses, selectedSchedule, sortBy]);

  // Paginated Events
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [processedEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedEvents.length / itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden py-24 px-6 md:px-16 select-none">
      {/* Title Header Banner */}
      <HeaderSection totalFound={processedEvents.length} />

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (3 cols): Filter Sidebar */}
        <aside className="lg:col-span-3">
          <EventFilterControls
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            selectedStatuses={selectedStatuses}
            onStatusToggle={handleStatusToggle}
            selectedSchedule={selectedSchedule}
            onScheduleChange={(s) => {
              setSelectedSchedule(s);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            isFilterActive={isFilterActive}
          />
        </aside>

        {/* Right Column (9 cols): Results Listing & Pagination */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-9 flex flex-col"
        >
          {/* Header Metadata and Sorting Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-white/5">
            <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
              Results: {processedEvents.length} Entries Found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortBy);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-0 text-[#00ffec] font-mono text-[10px] uppercase font-bold tracking-wider py-0 pl-1 pr-6 focus:ring-0 focus:border-0 cursor-pointer"
              >
                <option value="newest" className="bg-[#1d1b1a] text-[#e8e1df]">
                  New to Old
                </option>
                <option value="oldest" className="bg-[#1d1b1a] text-[#e8e1df]">
                  Old to New
                </option>
                <option value="title_asc" className="bg-[#1d1b1a] text-[#e8e1df]">
                  A - Z (Title)
                </option>
                <option value="title_desc" className="bg-[#1d1b1a] text-[#e8e1df]">
                  Z - A (Title)
                </option>
              </select>
            </div>
          </div>

          {/* Dynamic Event Listing Grid */}
          <EventList
            events={paginatedEvents}
            getPosterUrl={getPosterUrl}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.main>
      </div>
    </div>
  );
}

export default EventsClient;
