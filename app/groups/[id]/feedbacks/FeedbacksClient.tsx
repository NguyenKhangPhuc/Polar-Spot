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
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative max-w-7xl mx-auto">
      {/* Top Header & Navigation Section */}
      <div className="space-y-6 border-b border-white/12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton
            href={eventId ? `/events/${eventId}/groups` : "/events"}
            label="BACK TO EVENT GROUPS"
          />

          <span className="px-3.5 py-1.5 rounded-md bg-[#000000] border border-[#3be1fe]/50 text-[#3be1fe] font-mono font-bold text-xs uppercase tracking-wider shadow-sm self-start sm:self-auto">
            {filteredFeedbacks.length}{" "}
            {filteredFeedbacks.length === 1 ? "FEEDBACK" : "FEEDBACKS"} RECEIVED
          </span>
        </div>

        {/* Main Title & Group Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[#050505] border border-white/15 shrink-0 flex items-center justify-center shadow-md">
            {group?.avatar_url ? (
              <Image
                src={group.avatar_url}
                alt={groupName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#000000] text-[#3be1fe] font-black text-xl flex items-center justify-center font-mono border border-[#3be1fe]/30">
                {groupName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold text-[#3be1fe] uppercase tracking-widest block">
              PUBLIC EVALUATION &amp; FEEDBACKS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Group Feedbacks: <span className="text-[#3be1fe]">{groupName}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Controls: Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-md border border-white/12 shadow-md font-mono text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback by sender name or description..."
            className="w-full bg-[#050505] text-white border border-white/15 rounded-md px-4 py-2.5 text-xs outline-none focus:border-[#3be1fe]/70 transition-colors font-mono placeholder:text-slate-500"
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[10px] font-bold text-[#3be1fe] hover:underline uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            CLEAR SEARCH
          </button>
        )}
      </div>

      {/* Feedbacks List Container */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-[#121212] border border-white/12 rounded-md p-12 text-center space-y-3 shadow-xl font-mono text-xs">
            <p className="text-sm text-slate-300 font-bold font-sans">
              No feedback entries found matching your criteria.
            </p>
            <p className="text-xs text-slate-500">
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
                  className="bg-[#121212] border border-white/12 border-l-4 border-l-[#3be1fe] rounded-md p-5 sm:p-6 shadow-xl space-y-4 font-sans hover:border-white/20 transition-colors"
                >
                  {/* Feedback Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-sm bg-[#000000] border border-[#3be1fe]/40 text-[#3be1fe] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white tracking-tight truncate font-sans">
                          {displayName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          FEEDBACK SENDER
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      SUBMITTED: <strong className="text-slate-200">{createdDate}</strong>
                    </span>
                  </div>

                  {/* Feedback Description with Left Border & Padding */}
                  <div className="pl-4 sm:pl-5 border-l-2 border-[#3be1fe]/40 py-1">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
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
