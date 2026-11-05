"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import Pagination from "@/components/Pagination";
import { GroupFeedbackWithGroupAndEvent } from "@/app/types/group_feedbacks";
import { ProfileInsert } from "@/app/types/profile";
import { tw } from "@/app/constants/design-tokens";
import EditFeedbackModal from "./components/EditFeedbackModal";

interface FeedbacksManagementClientProps {
  initialFeedbacks: GroupFeedbackWithGroupAndEvent[];
  profile: ProfileInsert;
  isAdmin?: boolean;
  isJudge?: boolean;
}

type SortOption = "name_asc" | "name_desc" | "newest" | "oldest";

const ITEMS_PER_PAGE = 6;

export function FeedbacksManagementClient({
  initialFeedbacks,
  profile,
  isAdmin = false,
  isJudge = false,
}: FeedbacksManagementClientProps) {
  const [feedbacks, setFeedbacks] = useState<GroupFeedbackWithGroupAndEvent[]>(initialFeedbacks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingFeedback, setEditingFeedback] = useState<GroupFeedbackWithGroupAndEvent | null>(null);

  // 1. Extract Unique Events for Step 1 filter
  const uniqueEvents = useMemo(() => {
    const map = new Map<string, string>();
    feedbacks.forEach((fb) => {
      const evId = fb.groups?.event_id;
      const evTitle = fb.groups?.events?.title || "Unassigned Event";
      if (evId && !map.has(evId)) {
        map.set(evId, evTitle);
      }
    });
    return Array.from(map.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [feedbacks]);

  // 2. Sequential Step 2 filter: Groups belonging strictly to the selected Event
  const availableGroups = useMemo(() => {
    if (selectedEventId === "ALL") {
      return [];
    }
    const map = new Map<string, string>();
    feedbacks.forEach((fb) => {
      const grpId = fb.group_id;
      const grpName = fb.groups?.group_name || "Untitled Group";
      const grpEventId = fb.groups?.event_id;

      if (grpId && grpEventId === selectedEventId) {
        if (!map.has(grpId)) {
          map.set(grpId, grpName);
        }
      }
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [feedbacks, selectedEventId]);

  // Handle Event selection change (resets group filter if no longer valid)
  const handleEventChange = (newEventId: string) => {
    setSelectedEventId(newEventId);
    setSelectedGroupId("ALL");
    setCurrentPage(1);
  };

  // 3. Filter and Sort Feedbacks
  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    // Step 1: Event Filter
    if (selectedEventId !== "ALL") {
      result = result.filter((fb) => fb.groups?.event_id === selectedEventId);
    }

    // Step 2: Group Filter
    if (selectedGroupId !== "ALL") {
      result = result.filter((fb) => fb.group_id === selectedGroupId);
    }

    // Search Filter: Group, Event, Description, or Sender
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((fb) => {
        const groupName = fb.groups?.group_name?.toLowerCase() || "";
        const eventTitle = fb.groups?.events?.title?.toLowerCase() || "";
        const desc = fb.description?.toLowerCase() || "";
        const sender = fb.display_name?.toLowerCase() || "";
        return (
          groupName.includes(q) ||
          eventTitle.includes(q) ||
          desc.includes(q) ||
          sender.includes(q)
        );
      });
    }

    // Sorting based on Name (A-Z, Z-A) or Date (Newest, Oldest)
    result.sort((a, b) => {
      const grpA = (a.groups?.group_name || "").toLowerCase();
      const grpB = (b.groups?.group_name || "").toLowerCase();
      const evA = (a.groups?.events?.title || "").toLowerCase();
      const evB = (b.groups?.events?.title || "").toLowerCase();
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sortOption) {
        case "name_asc": {
          const cmp = grpA.localeCompare(grpB);
          if (cmp !== 0) return cmp;
          return evA.localeCompare(evB);
        }
        case "name_desc": {
          const cmp = grpB.localeCompare(grpA);
          if (cmp !== 0) return cmp;
          return evB.localeCompare(evA);
        }
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        default:
          return 0;
      }
    });

    return result;
  }, [
    feedbacks,
    selectedEventId,
    selectedGroupId,
    searchQuery,
    sortOption,
  ]);

  // 4. Pagination slicing
  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedFeedbacks = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredFeedbacks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFeedbacks, safeCurrentPage]);

  // Handle in-memory update from modal
  const handleFeedbackUpdated = (updated: GroupFeedbackWithGroupAndEvent) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === updated.id ? { ...fb, ...updated } : fb))
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedEventId("ALL");
    setSelectedGroupId("ALL");
    setSortOption("name_asc");
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Header & Navigation */}
        <div className="flex flex-col gap-2">
          <BackButton fallbackHref="/" label="BACK" className="mb-0" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
            <div className="flex gap-4 items-stretch">
              <div className={`w-[3px] ${tw.bg.accentBar}`} />
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                  FEEDBACKS MANAGEMENT
                </h1>
                <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex items-center gap-2">
                  <span>ROLE: {isAdmin ? "ADMINISTRATOR" : isJudge ? "JUDGE" : "EVALUATOR"}</span>
                  <span>{"//"}</span>
                  <span>MY SUBMITTED FEEDBACKS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sequential Controls & Search Panel */}
        <div className="bg-[#1d1b1a] border border-white/5 p-5 rounded-sm flex flex-col gap-4 shadow-xl">
          {/* Top Row: Search input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by group name, event title, or feedback description..."
                className="w-full bg-[#151312] text-[#e8e1df] border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#00ffec]/50 transition-colors font-mono placeholder:text-[#83958d]/50"
              />
              <svg
                className="w-4 h-4 absolute left-3 text-[#00ffec] pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {Boolean(searchQuery || selectedEventId !== "ALL" || selectedGroupId !== "ALL" || sortOption !== "name_asc") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/30 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 font-mono"
              >
                RESET FILTERS
              </button>
            )}
          </div>

          {/* Sequential Filters & Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs font-mono">
            {/* Step 1: Filter based on Events */}
            <div className="flex flex-col gap-1">
              <label className="text-[8.5px] font-mono text-[#83958d] uppercase tracking-wider font-bold">
                STEP 1: FILTER BY EVENT
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => handleEventChange(e.target.value)}
                className="bg-[#151312] text-[#e8e1df] border border-white/10 rounded-sm p-2 text-xs outline-none focus:border-[#00ffec]/50 font-mono cursor-pointer uppercase appearance-none"
              >
                <option value="ALL">ALL EVENTS ({uniqueEvents.length})</option>
                {uniqueEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Filter based on Groups (Enabled after selecting an Event) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[8.5px] font-mono text-[#83958d] uppercase tracking-wider font-bold">
                  STEP 2: FILTER BY GROUP
                </label>
                {selectedEventId === "ALL" && (
                  <span className="text-[8px] text-[#83958d] font-mono uppercase tracking-tight">
                    PICK EVENT FIRST
                  </span>
                )}
              </div>
              <select
                disabled={selectedEventId === "ALL"}
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setCurrentPage(1);
                }}
                className={`bg-[#151312] text-[#e8e1df] border rounded-sm p-2 text-xs outline-none font-mono uppercase appearance-none transition-colors ${
                  selectedEventId === "ALL"
                    ? "border-white/5 opacity-40 cursor-not-allowed text-[#83958d]"
                    : "border-white/10 cursor-pointer focus:border-[#00ffec]/50"
                }`}
              >
                {selectedEventId === "ALL" ? (
                  <option value="ALL">-- PICK AN EVENT FIRST --</option>
                ) : (
                  <>
                    <option value="ALL">ALL GROUPS IN THIS EVENT ({availableGroups.length})</option>
                    {availableGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Step 3: Sort Order (Name A-Z, Name Z-A, Newest, Oldest) */}
            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
              <label className="text-[8.5px] font-mono text-[#83958d] uppercase tracking-wider font-bold">
                STEP 3: SORT ORDER
              </label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-[#151312] text-[#e8e1df] border border-white/10 rounded-sm p-2 text-xs outline-none focus:border-[#00ffec]/50 font-mono cursor-pointer uppercase appearance-none"
              >
                <option value="name_asc">NAME: A - Z</option>
                <option value="name_desc">NAME: Z - A</option>
                <option value="newest">DATE: NEWEST FIRST</option>
                <option value="oldest">DATE: OLDEST FIRST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedbacks Listing Container */}
        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-16 text-center space-y-3 font-mono shadow-xl">
              <p className="text-base text-[#e8e1df] font-bold font-mono uppercase tracking-wider">
                No feedback records found matching your filters.
              </p>
              <p className="text-xs text-[#83958d]">
                Feedback submitted via the group card modal or grading console will appear here.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/30 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                CLEAR ACTIVE FILTERS
              </button>
            </div>
          ) : (
            <motion.div
              key={`page-${safeCurrentPage}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              {paginatedFeedbacks.map((fb) => {
                const groupName = fb.groups?.group_name || "Startup Team";
                const eventTitle = fb.groups?.events?.title || "Event Pitching";
                const eventId = fb.groups?.event_id;
                const createdDate = fb.created_at
                  ? new Date(fb.created_at).toLocaleString()
                  : "N/A";
                const isOwner = fb.user_id === profile?.id;

                return (
                  <div
                    key={fb.id}
                    className="bg-[#1d1b1a] border border-white/5 hover:border-white/15 rounded-sm p-5 sm:p-6 space-y-4 font-mono shadow-xl transition-colors border-l-4 border-l-[#00ffec]"
                  >
                    {/* Header: Group, Event & Meta Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      {/* Left: Group Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-[#151312] border border-white/10 shrink-0 flex items-center justify-center shadow-md">
                          {fb.groups?.avatar_url ? (
                            <Image
                              src={fb.groups.avatar_url}
                              alt={groupName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#100e0d] text-[#00ffec] font-bold text-base flex items-center justify-center font-mono border border-[#00ffec]/30">
                              {groupName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-bold text-[#e8e1df] tracking-tight truncate font-sans">
                              {groupName}
                            </h3>
                            <span className="px-2 py-0.5 rounded-sm bg-[#151312] border border-[#00ffec]/30 text-[9px] font-mono text-[#00ffec] font-bold uppercase tracking-wider">
                              {eventTitle}
                            </span>
                          </div>
                          <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider flex items-center gap-2 mt-0.5">
                            <span>SENDER: <strong className="text-[#b9cbc2]">{fb.display_name || "Anonymous"}</strong></span>
                            {isOwner && (
                              <span className="text-[#00ffec] bg-[#00ffec]/10 px-1.5 py-0.2 rounded-sm border border-[#00ffec]/20 font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Date & Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider mr-2">
                          SUBMITTED: <strong className="text-[#b9cbc2] font-semibold">{createdDate}</strong>
                        </span>

                        {/* Edit Button */}
                        {(isOwner || isAdmin) && (
                          <button
                            type="button"
                            onClick={() => setEditingFeedback(fb)}
                            className="px-3 py-1.5 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>EDIT</span>
                          </button>
                        )}

                        {/* Grade Group Link */}
                        {fb.group_id && (
                          <Link
                            href={`/groups/${fb.group_id}/grading`}
                            className="px-3 py-1.5 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            GRADE
                          </Link>
                        )}

                        {/* Event Groups Link */}
                        {eventId && (
                          <Link
                            href={`/events/${eventId}/groups`}
                            className="px-3 py-1.5 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/30 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            EVENT
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Feedback Description (Scrollable container with max-height) */}
                    <div className="pl-4 sm:pl-5 border-l-2 border-[#00ffec]/30 py-1 bg-[#151312]/60 p-3 rounded-sm">
                      <p className="text-xs sm:text-sm text-[#e8e1df] leading-relaxed whitespace-pre-line font-mono font-normal select-text max-h-40 overflow-y-auto pr-2">
                        {fb.description || "No feedback description provided."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Dynamic Pagination Controls */}
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Edit Feedback Modal */}
        <EditFeedbackModal
          feedback={editingFeedback}
          isOpen={Boolean(editingFeedback)}
          onClose={() => setEditingFeedback(null)}
          onFeedbackUpdated={handleFeedbackUpdated}
        />
      </div>
    </div>
  );
}

export default FeedbacksManagementClient;
