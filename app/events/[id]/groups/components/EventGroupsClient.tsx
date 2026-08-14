"use client";

/**
 * PURPOSE:
 * Orchestrator client component for the Event Pitching Groups roster portal at app/events/[id]/groups.
 * Manages state for real-time text searching (group name/description) and sorting (created_at date, group name alphabetical),
 * delegating UI rendering to modular subcomponents (HeaderSection, GroupFilterControls, GroupGrid).
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/[id]/groups/page.tsx' Server Component.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload.
 * - groups (GroupWithMembersAndEvent[], Required): List of groups registered for this event.
 */

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import HeaderSection from "./HeaderSection";
import GroupFilterControls, { GroupSortOrder } from "./GroupFilterControls";
import GroupGrid from "./GroupGrid";

interface EventGroupsClientProps {
  event: Event;
  groups: GroupWithMembersAndEvent[];
}

export function EventGroupsClient({ event, groups }: EventGroupsClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<GroupSortOrder>("newest");

  /**
   * BEHAVIORAL MECHANISM:
   * Memoized computation filtering groups by text search query and sorting by created_at timestamp
   * or alphabetical group_name.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - GroupWithMembersAndEvent[]: Filtered and sorted group records.
   */
  const processedGroups = useMemo(() => {
    let result = [...groups];

    // 1. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          (g.group_name && g.group_name.toLowerCase().includes(q)) ||
          (g.short_description && g.short_description.toLowerCase().includes(q))
      );
    }

    // 2. Sort order logic
    result.sort((a, b) => {
      if (sortOrder === "newest" || sortOrder === "oldest") {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
      if (sortOrder === "name_asc" || sortOrder === "name_desc") {
        const nameA = (a.group_name || "").toLowerCase();
        const nameB = (b.group_name || "").toLowerCase();
        return sortOrder === "name_asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    return result;
  }, [groups, searchQuery, sortOrder]);

  /**
   * BEHAVIORAL MECHANISM:
   * Resets search query string and sort order state back to default values.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleResetFilters = (): void => {
    setSearchQuery("");
    setSortOrder("newest");
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative">
      {/* Header Section */}
      <HeaderSection event={event} totalFound={processedGroups.length} />

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Narrower Sticky Filter Panel (lg:col-span-4) */}
        <GroupFilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onResetFilters={handleResetFilters}
        />

        {/* Right Column: 2-Groups-Per-Row Grid (lg:col-span-8) */}
        <main className="lg:col-span-8">
          <GroupGrid
            groups={processedGroups}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </div>
  );
}

export default EventGroupsClient;
