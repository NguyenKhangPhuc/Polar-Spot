"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import HeaderSection from "./HeaderSection";
import GroupFilterControls, { GroupSortOrder } from "./GroupFilterControls";
import GroupGrid from "./GroupGrid";

interface EventGroupsClientProps {
  event: Event;
  groups: GroupWithMembersAndEvent[];
  canGrade?: boolean;
}

export function EventGroupsClient({ event, groups, canGrade = false }: EventGroupsClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<GroupSortOrder>("newest");

  const processedGroups = useMemo(() => {
    let result = [...groups];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          (g.group_name && g.group_name.toLowerCase().includes(q)) ||
          (g.short_description && g.short_description.toLowerCase().includes(q))
      );
    }

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

  const handleResetFilters = (): void => {
    setSearchQuery("");
    setSortOrder("newest");
  };

  return (
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative max-w-7xl mx-auto">
      {/* Header Section */}
      <HeaderSection event={event} totalFound={processedGroups.length} />

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Filter Control Panel */}
        <GroupFilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onResetFilters={handleResetFilters}
        />

        {/* Right Column: Groups Grid */}
        <main className="lg:col-span-8">
          <GroupGrid
            groups={processedGroups}
            onResetFilters={handleResetFilters}
            canGrade={canGrade}
          />
        </main>
      </div>
    </div>
  );
}

export default EventGroupsClient;
