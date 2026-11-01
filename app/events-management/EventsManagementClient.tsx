"use client";

import React, { useState, useMemo } from "react";
import { Event } from "../types/event";
import { EVENT_STATUS } from "../types/enum";

import HeaderSection from "./components/HeaderSection";
import EventFilterControls from "./components/EventFilterControls";
import EventsTable from "./components/EventsTable";
import CreateEventModal from "./components/CreateEventModal";

type SortOrder = "asc" | "desc";

interface EventsManagementClientProps {
  initialEvents: Event[];
  isAdmin?: boolean;
}

export default function EventsManagementClient({
  initialEvents,
  isAdmin = false,
}: EventsManagementClientProps) {
  // Local state management
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EVENT_STATUS | "">("");
  const [sortBy, setSortBy] = useState<SortOrder>("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...eventsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((event) => {
        const title = typeof event.title === "string" ? event.title : "";
        const desc = typeof event.short_description === "string" ? event.short_description : "";
        const cnt = typeof event.content === "string" ? event.content : "";
        const loc = typeof event.location === "string" ? event.location : "";
        return (
          title.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          cnt.toLowerCase().includes(q) ||
          loc.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter) {
      result = result.filter((event) => event.status === statusFilter);
    }

    result.sort((a, b) => {
      const nameA = typeof a.title === "string" && a.title.trim() ? a.title : (a.short_description || "");
      const nameB = typeof b.title === "string" && b.title.trim() ? b.title : (b.short_description || "");
      if (sortBy === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return result;
  }, [eventsList, searchQuery, statusFilter, sortBy]);

  const handleStatusUpdated = (eventId: string, newStatus: EVENT_STATUS) => {
    setEventsList((prev) =>
      prev.map((item) =>
        item.id === eventId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleEventCreated = (newEvent: Event) => {
    setEventsList((prev) => [newEvent, ...prev]);
  };

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Header Title & Trigger Section */}
      <HeaderSection onOpenModal={() => setIsModalOpen(true)} isAdmin={isAdmin} />

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
      <div className="flex flex-col gap-4">
        {/* Table Metrics Bar */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00ffec]" />
            <span>01 EVENT REGISTRY DATABASE</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL EVENTS: {filteredAndSortedEvents.length}
          </span>
        </div>

        <EventsTable
          events={filteredAndSortedEvents}
          onStatusUpdated={handleStatusUpdated}
          isAdmin={isAdmin}
        />
      </div>

      {/* Create Event Modal Dialog */}
      {isAdmin && (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
}
