"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Event } from "../types/event";
import { EVENT_STATUS } from "../types/enum";

import HeaderSection from "./components/HeaderSection";
import EventFilterControls from "./components/EventFilterControls";
import EventsTable from "./components/EventsTable";
import CreateEventModal from "./components/CreateEventModal";

type SortOrder = "asc" | "desc";

/**
 * PURPOSE:
 * Orchestrator client component for the Events Management dashboard. Coordinates state for events,
 * real-time text searching, status filtering, title sorting, modal toggles, and delegating UI rendering to modular sub-components.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/events-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - initialEvents (Event[], Required): Initial list of events fetched from Supabase server side.
 */

interface EventsManagementClientProps {
  initialEvents: Event[];
}

export default function EventsManagementClient({
  initialEvents,
}: EventsManagementClientProps) {
  const router = useRouter();

  // Local state management
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EVENT_STATUS | "">("");
  const [sortBy, setSortBy] = useState<SortOrder>("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * BEHAVIORAL MECHANISM:
   * Computes filtered and sorted events using memoization to avoid unnecessary re-renders.
   * Applies title/location search filter, status filter, and title sorting.
   *
   * PARAMETERS:
   * None (uses eventsList, searchQuery, statusFilter, sortBy from state).
   *
   * RETURNS:
   * - Event[]: Filtered and sorted list of events.
   */
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

    // 3. Sorting (by short_description or content)
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

  /**
   * BEHAVIORAL MECHANISM:
   * Callback invoked when an event's status is updated inline from the EventsTable.
   * Updates local state and triggers router refresh for server cache sync.
   *
   * PARAMETERS:
   * - eventId (string): Unique identifier of the updated event.
   * - newStatus (EVENT_STATUS): Newly assigned status.
   *
   * RETURNS:
   * - void
   */
  const handleStatusUpdated = (eventId: string, newStatus: EVENT_STATUS) => {
    setEventsList((prev) =>
      prev.map((item) =>
        item.id === eventId ? { ...item, status: newStatus } : item
      )
    );
    router.refresh();
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Callback invoked when a new event is created via CreateEventModal.
   * Prepends the created event to local state list and triggers router refresh.
   *
   * PARAMETERS:
   * - newEvent (Event): Newly created event record.
   *
   * RETURNS:
   * - void
   */
  const handleEventCreated = (newEvent: Event) => {
    setEventsList((prev) => [newEvent, ...prev]);
    router.refresh();
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100">
      {/* Header Title & Trigger Section */}
      <HeaderSection onOpenModal={() => setIsModalOpen(true)} />

      {/* Search Bar & Filter Controls */}
      <EventFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Tabular Display of Events */}
      <EventsTable
        events={filteredAndSortedEvents}
        onStatusUpdated={handleStatusUpdated}
      />

      {/* Create Event Modal Dialog */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
