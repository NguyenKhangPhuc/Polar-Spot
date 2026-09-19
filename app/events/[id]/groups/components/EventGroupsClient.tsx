"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import { ProfileInsert } from "@/app/types/profile";
import HeaderSection from "./HeaderSection";
import GroupFilterControls, { GroupSortOrder } from "./GroupFilterControls";
import GroupGrid from "./GroupGrid";
import GroupDetailModal from "./GroupDetailModal";
import GiveFeedbackModal from "./GiveFeedbackModal";

interface EventGroupsClientProps {
  event: Event;
  groups: GroupWithMembersAndEvent[];
  canGrade?: boolean;
  profile: ProfileInsert;
}

export function EventGroupsClient({
  event,
  groups,
  canGrade = false,
  profile,
}: EventGroupsClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<GroupSortOrder>("newest");
  const [selectedGroupForModal, setSelectedGroupForModal] =
    useState<GroupWithMembersAndEvent | null>(null);
  const [feedbackTargetGroup, setFeedbackTargetGroup] =
    useState<GroupWithMembersAndEvent | null>(null);

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
    <div className="w-full flex flex-col gap-8 select-text">
      {/* 1. Header Title & Actions Section */}
      <HeaderSection event={event} totalFound={processedGroups.length} />

      {/* 2. Top-Level Filter & Search Controls */}
      <GroupFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Groups List Section */}
      <div className="flex flex-col gap-4">
        {/* Metric Bar */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00ffec]" />
            <span>01 REGISTERED PITCHING GROUPS</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL GROUPS: {processedGroups.length}
          </span>
        </div>

        {/* 2-Column Groups Grid */}
        <GroupGrid
          groups={processedGroups}
          onResetFilters={handleResetFilters}
          canGrade={canGrade}
          onSelectGroup={(group) => setSelectedGroupForModal(group)}
          onOpenGiveFeedback={(group) => setFeedbackTargetGroup(group)}
        />
      </div>

      {/* 4. Large Centered Group Detail Modal with YouTube Video */}
      <GroupDetailModal
        group={selectedGroupForModal}
        isOpen={Boolean(selectedGroupForModal)}
        onClose={() => setSelectedGroupForModal(null)}
        canGrade={canGrade}
        onOpenGiveFeedback={(group) => setFeedbackTargetGroup(group)}
      />

      {/* 5. Feedback Submission Modal */}
      {feedbackTargetGroup && (
        <GiveFeedbackModal
          group={feedbackTargetGroup}
          isOpen={Boolean(feedbackTargetGroup)}
          onClose={() => setFeedbackTargetGroup(null)}
          profile={profile}
        />
      )}
    </div>
  );
}

export default EventGroupsClient;
