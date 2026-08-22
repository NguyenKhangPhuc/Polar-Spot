"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import HeaderSection from "./HeaderSection";
import EventFilterControls from "./EventFilterControls";
import EventList from "./EventList";

interface EventsClientProps {
  events: Event[];
}

type SortOrder = "newest" | "oldest";

export function EventsClient({ events }: EventsClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

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

  const processedEvents = useMemo(() => {
    let result = [...events];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          ((e as any).title && (e as any).title.toLowerCase().includes(q)) ||
          (e.short_description && e.short_description.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.start_date || 0).getTime();
      const dateB = new Date(b.created_at || b.start_date || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [events, searchQuery, statusFilter, sortOrder]);

  const handleResetFilters = (): void => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  return (
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative max-w-7xl mx-auto">
      {/* Header Section */}
      <HeaderSection totalFound={processedEvents.length} />

      {/* Top Filter Controls Bar */}
      <EventFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onResetFilters={handleResetFilters}
      />

      {/* Main Multi-Column Events Grid */}
      <main className="w-full pt-2">
        <EventList
          events={processedEvents}
          getPosterUrl={getPosterUrl}
          onResetFilters={handleResetFilters}
        />
      </main>
    </div>
  );
}

export default EventsClient;
