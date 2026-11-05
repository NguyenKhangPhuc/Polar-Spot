"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { GroupFeedback } from "@/app/types/group_feedbacks";
import { Group } from "@/app/types/groups";
import { createClient } from "@/app/utils/supabase/client";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { tw } from "@/app/constants/design-tokens";

interface FeedbacksClientProps {
  feedbacks: GroupFeedback[];
  group: Group;
}

export function FeedbacksClient({ feedbacks, group }: FeedbacksClientProps) {
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const groupName = group?.group_name || "Startup Group";
  const eventId = group?.event_id;

  const filteredFeedbacks = useMemo(() => {
    if (!searchQuery.trim()) return feedbacks;
    const q = searchQuery.toLowerCase().trim();
    return feedbacks.filter(
      (f) =>
        (f.display_name && f.display_name.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q))
    );
  }, [feedbacks, searchQuery]);

  const handleExportFeedbacksToExcel = async (): Promise<void> => {
    if (!group?.id || isExporting) return;

    setIsExporting(true);
    setIsOpenLoader(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("group_feedbacks")
        .select("*")
        .eq("group_id", group.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error("Failed to fetch group feedbacks for export");
      }

      if (!data || data.length === 0) {
        showNotification("No feedback records available to export");
        return;
      }

      const rows = data.map((item, idx) => ({
        "No.": idx + 1,
        "Group Name": groupName,
        "Display Name": item.display_name || "Anonymous",
        "Feedback Description": item.description || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = [
        { wch: 6 },
        { wch: 26 },
        { wch: 24 },
        { wch: 65 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Group Feedbacks");

      const sanitizedGroupName = groupName
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "");
      const fileName = `${sanitizedGroupName || "group"}_feedbacks.xlsx`;

      XLSX.writeFile(workbook, fileName);
      showNotification("Feedbacks exported to Excel successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to export feedbacks";
      showNotification(message);
    } finally {
      setIsExporting(false);
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <BackButton
          fallbackHref={eventId ? `/events/${eventId}/groups` : "/events"}
          label="BACK"
          className="mb-0"
        />

        {/* Page Header */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-6 border-b ${tw.border.whiteSubtle} pb-8 mb-2 select-none`}
        >
          <div className="flex gap-4 items-center">
            <div className={`w-[3px] self-stretch ${tw.bg.accentBar}`} />
            <div
              className={`relative w-12 h-12 ${tw.radius.avatar} overflow-hidden ${tw.bg.main} border border-white/10 shrink-0 flex items-center justify-center shadow-md`}
            >
              {group?.avatar_url ? (
                <Image
                  src={group.avatar_url}
                  alt={groupName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full ${tw.bg.avatarFallback} font-bold text-lg flex items-center justify-center font-mono`}
                >
                  {groupName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <h1
                className={`text-2xl sm:text-3xl font-extrabold ${tw.text.primary} tracking-tight uppercase leading-tight font-mono`}
              >
                Group Feedbacks
              </h1>
              <div
                className={`text-[9px] font-mono ${tw.text.subMuted} uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text`}
              >
                <span>GROUP: {groupName.toUpperCase()}</span>
                <span>|</span>
                <span>TOTAL: {feedbacks.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <span
              className={`px-3.5 py-2.5 ${tw.radius.pill} ${tw.bg.badgeAccent} font-mono font-bold text-xs uppercase tracking-wider shadow-sm`}
            >
              {filteredFeedbacks.length}{" "}
              {filteredFeedbacks.length === 1 ? "FEEDBACK" : "FEEDBACKS"} RECEIVED
            </span>

            <button
              type="button"
              onClick={handleExportFeedbacksToExcel}
              disabled={isExporting || feedbacks.length === 0}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 ${tw.radius.button} text-xs font-mono ${tw.bg.buttonPrimary} disabled:opacity-40 disabled:pointer-events-none cursor-pointer`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>{isExporting ? "EXPORTING..." : "EXPORT EXCEL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls: Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${tw.bg.surfacePanel} p-4 ${tw.radius.card} font-mono text-xs`}
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback by sender name or description..."
            className={`w-full ${tw.bg.surfaceInput} ${tw.radius.button} px-4 py-2.5 text-xs outline-none transition-colors font-mono`}
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className={`text-[10px] font-bold ${tw.text.accent} hover:underline uppercase tracking-wider transition-colors cursor-pointer shrink-0 font-mono`}
          >
            CLEAR SEARCH
          </button>
        )}
      </div>

      {/* Feedbacks List Container */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div
            className={`${tw.bg.surfacePanel} ${tw.radius.card} p-12 text-center space-y-3 font-mono text-xs`}
          >
            <p
              className={`text-sm ${tw.text.primary} font-bold font-mono uppercase tracking-wider`}
            >
              No feedback entries found matching your criteria.
            </p>
            <p className={`text-xs ${tw.text.subMuted}`}>
              Feedback submitted via the group card modal will be listed here.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFeedbacks.map((fb, index) => {
              const displayName = fb.display_name || "Anonymous";
              const createdDate = fb.created_at
                ? new Date(fb.created_at).toLocaleString()
                : "N/A";

              return (
                <motion.div
                  key={fb.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.04, 0.25),
                  }}
                  className={`${tw.bg.surfacePanel} ${tw.border.accentLeft} ${tw.radius.card} p-5 sm:p-6 space-y-4 font-mono hover:border-white/10 transition-colors`}
                >
                  {/* Feedback Header */}
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${tw.border.whiteSubtle} pb-3`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 ${tw.radius.avatar} ${tw.bg.avatarFallback} font-bold font-mono text-xs flex items-center justify-center shrink-0`}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-bold ${tw.text.primary} tracking-tight truncate font-mono`}
                        >
                          {displayName}
                        </h4>
                        <span
                          className={`text-[9px] font-mono ${tw.text.subMuted} uppercase tracking-wider block`}
                        >
                          FEEDBACK SENDER
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono ${tw.text.subMuted} uppercase tracking-wider shrink-0`}
                    >
                      SUBMITTED:{" "}
                      <strong className={`${tw.text.muted} font-semibold`}>
                        {createdDate}
                      </strong>
                    </span>
                  </div>

                  {/* Feedback Description with Left Border & Padding */}
                  <div className={`pl-4 sm:pl-5 ${tw.border.quoteLeft} py-1`}>
                    <p
                      className={`text-xs sm:text-sm ${tw.text.primary} leading-relaxed whitespace-pre-wrap font-mono font-normal`}
                    >
                      {fb.description || "No feedback description provided."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default FeedbacksClient;
