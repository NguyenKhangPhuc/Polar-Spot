"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import { GroupFeedback } from "@/app/types/group_feedbacks";

interface FeedbacksClientProps {
  feedbacks: GroupFeedback[];
  group: any;
}

export function FeedbacksClient({ feedbacks, group }: FeedbacksClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <BackButton
          href={eventId ? `/events/${eventId}/groups` : "/events"}
          label="BACK TO EVENT GROUPS"
          className="mb-0"
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-center">
            <div className="w-[3px] self-stretch bg-[#00ffec]" />
            <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-[#151312] border border-white/10 shrink-0 flex items-center justify-center shadow-md">
              {group?.avatar_url ? (
                <Image
                  src={group.avatar_url}
                  alt={groupName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#151312] text-[#00ffec] font-bold text-lg flex items-center justify-center font-mono border border-[#00ffec]/30">
                  {groupName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                Group Feedbacks
              </h1>
              <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
                <span>GROUP: {groupName.toUpperCase()}</span>
                <span>|</span>
                <span>TOTAL: {feedbacks.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-sm bg-[#1d1b1a] border border-[#00ffec]/30 text-[#00ffec] font-mono font-bold text-xs uppercase tracking-wider shadow-sm">
              {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? "FEEDBACK" : "FEEDBACKS"} RECEIVED
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1d1b1a] p-4 rounded-sm border border-white/5 shadow-md font-mono text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback by sender name or description..."
            className="w-full bg-[#151312] text-[#e8e1df] border border-white/10 rounded-sm px-4 py-2.5 text-xs outline-none focus:border-[#00ffec]/50 transition-colors font-mono placeholder:text-[#83958d]/50"
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[10px] font-bold text-[#00ffec] hover:underline uppercase tracking-wider transition-colors cursor-pointer shrink-0 font-mono"
          >
            CLEAR SEARCH
          </button>
        )}
      </div>

      {/* Feedbacks List Container */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-12 text-center space-y-3 shadow-xl font-mono text-xs">
            <p className="text-sm text-[#e8e1df] font-bold font-mono uppercase tracking-wider">
              No feedback entries found matching your criteria.
            </p>
            <p className="text-xs text-[#83958d]">
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
                  className="bg-[#1d1b1a] border border-white/5 border-l-4 border-l-[#00ffec] rounded-sm p-5 sm:p-6 shadow-xl space-y-4 font-mono hover:border-white/10 transition-colors"
                >
                  {/* Feedback Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-sm bg-[#151312] border border-[#00ffec]/30 text-[#00ffec] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#e8e1df] tracking-tight truncate font-mono">
                          {displayName}
                        </h4>
                        <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider block">
                          FEEDBACK SENDER
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider shrink-0">
                      SUBMITTED: <strong className="text-[#b9cbc2] font-semibold">{createdDate}</strong>
                    </span>
                  </div>

                  {/* Feedback Description with Left Border & Padding */}
                  <div className="pl-4 sm:pl-5 border-l-2 border-[#00ffec]/30 py-1">
                    <p className="text-xs sm:text-sm text-[#e8e1df] leading-relaxed whitespace-pre-wrap font-mono font-normal">
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
