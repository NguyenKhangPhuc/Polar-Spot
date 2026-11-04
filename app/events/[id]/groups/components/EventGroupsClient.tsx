"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/app/types/event";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import { ProfileInsert } from "@/app/types/profile";
import { GroupFeedback } from "@/app/types/group_feedbacks";
import { getGroupFeedbacksByGroupId } from "@/app/actions/group_feedbacks";
import { useLoader } from "@/app/context/LoaderContext";
import Pagination from "@/components/Pagination";
import HeaderSection from "./HeaderSection";
import GroupFilterControls, { GroupSortOrder } from "./GroupFilterControls";
import GroupGrid from "./GroupGrid";
import GroupDetailModal from "./GroupDetailModal";
import GiveFeedbackModal from "./GiveFeedbackModal";

interface EventGroupsClientProps {
  event: Event;
  groups: GroupWithMembersAndEvent[];
  canGrade?: boolean;
  canGiveFeedback?: boolean;
  profile: ProfileInsert;
}

const ITEMS_PER_PAGE = 6;

export function EventGroupsClient({
  event,
  groups,
  canGrade = true,
  canGiveFeedback = true,
  profile,
}: EventGroupsClientProps) {
  const { setIsOpenLoader } = useLoader();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<GroupSortOrder>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedGroupForModal, setSelectedGroupForModal] =
    useState<GroupWithMembersAndEvent | null>(null);
  const [feedbackTargetGroup, setFeedbackTargetGroup] =
    useState<GroupWithMembersAndEvent | null>(null);
  const [initialFeedback, setInitialFeedback] = useState<GroupFeedback | null>(null);

  const handleOpenGiveFeedback = async (group: GroupWithMembersAndEvent) => {
    setIsOpenLoader(true);
    try {
      const { data } = await getGroupFeedbacksByGroupId(group.id);
      setInitialFeedback(data || null);
    } catch (err) {
      console.error("Failed to load group feedback:", err);
      setInitialFeedback(null);
    } finally {
      setIsOpenLoader(false);
      setFeedbackTargetGroup(group);
    }
  };

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

  const totalPages = Math.ceil(processedGroups.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedGroups = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return processedGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedGroups, safeCurrentPage]);

  const handleResetFilters = (): void => {
    setSearchQuery("");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* 1. Header Title & Actions Section */}
      <HeaderSection event={event} totalFound={processedGroups.length} />

      {/* 2. Main 2-Column Responsive Body (Sidebar on Left, Groups on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="w-full lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
          <GroupFilterControls
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            sortOrder={sortOrder}
            setSortOrder={(s) => {
              setSortOrder(s);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Column: Groups List Section */}
        <div className="w-full lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
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

          {/* Groups Grid */}
          <GroupGrid
            groups={paginatedGroups}
            onResetFilters={handleResetFilters}
            canGrade={canGrade}
            canGiveFeedback={canGiveFeedback}
            onSelectGroup={(group) => setSelectedGroupForModal(group)}
            onOpenGiveFeedback={handleOpenGiveFeedback}
          />

          {/* Dynamic Pagination */}
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* 4. Large Centered Group Detail Modal with YouTube Video */}
      <GroupDetailModal
        group={selectedGroupForModal}
        isOpen={Boolean(selectedGroupForModal)}
        onClose={() => setSelectedGroupForModal(null)}
        canGrade={canGrade}
        canGiveFeedback={canGiveFeedback}
        onOpenGiveFeedback={handleOpenGiveFeedback}
      />

      {/* 5. Feedback Submission Modal */}
      {feedbackTargetGroup && (
        <GiveFeedbackModal
          group={feedbackTargetGroup}
          isOpen={Boolean(feedbackTargetGroup)}
          onClose={() => {
            setFeedbackTargetGroup(null);
            setInitialFeedback(null);
          }}
          profile={profile}
          initialFeedback={initialFeedback}
        />
      )}
    </div>
  );
}

export default EventGroupsClient;
