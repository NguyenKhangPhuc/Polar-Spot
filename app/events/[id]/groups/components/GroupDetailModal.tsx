"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import FixedYoutubeVideo from "@/app/components/FixedYoutubeVideo";

interface GroupDetailModalProps {
  group: GroupWithMembersAndEvent | null;
  isOpen: boolean;
  onClose: () => void;
  canGrade?: boolean;
  onOpenGiveFeedback?: (group: GroupWithMembersAndEvent) => void;
}

export function GroupDetailModal({
  group,
  isOpen,
  onClose,
  canGrade = false,
  onOpenGiveFeedback,
}: GroupDetailModalProps) {
  if (!group) return null;

  const members = group.group_members || [];
  const createdDateStr = group.created_at
    ? new Date(group.created_at).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
    : "N/A";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          {/* Backdrop Click */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative my-auto w-full max-w-4xl bg-[#1d1b1a] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl text-[#e8e1df] font-mono text-xs z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5 gap-4">
              <div className="space-y-2.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-[#00ffec] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec]" />
                    REGISTERED STARTUP TEAM
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#e8e1df] uppercase tracking-tight font-sans">
                  {group.group_name || "UNNAMED GROUP"}
                </h2>

                {/* Short Description located directly under Title */}
                {group.short_description ? (
                  <p className="text-xs leading-relaxed text-[#b9cbc2] font-sans whitespace-pre-wrap pt-0.5">
                    {group.short_description}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#83958d] font-sans pt-0.5">
                    No pitch description provided for this group.
                  </p>
                )}

                {/* Metadata info */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-[#83958d] pt-1">
                  <div>
                    CREATED: <strong className="text-[#e8e1df]">{createdDateStr}</strong>
                  </div>
                  <div>
                    ROSTER: <strong className="text-[#00ffec]">{members.length} MEMBERS</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-[#83958d] hover:text-[#e8e1df] p-1.5 rounded-none bg-[#151312] border border-white/10 hover:border-white/20 cursor-pointer transition-colors shrink-0"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* YouTube Video Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-3 bg-[#00ffec]" />
                  PITCH VIDEO PRESENTATION
                </span>
                {group.youtube_link && (
                  <a
                    href={group.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-[#00ffec] hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <span>OPEN ON YOUTUBE</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <FixedYoutubeVideo
                youtubeUrl={group.youtube_link}
                title={`${group.group_name || "Group"} Pitch Video`}
              />
            </div>

            {/* Team Members Roster */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-[#00ffec]" />
                TEAM MEMBERS ROSTER ({members.length})
              </span>

              {members.length === 0 ? (
                <div className="bg-[#151312] border border-white/5 rounded-sm p-4 text-center text-[#83958d] text-xs font-mono italic">
                  No member profiles registered in this group yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {members.map((member) => {
                    const displayName = member.member_name || member.member_email || "UNNAMED MEMBER";
                    const email = member.member_email || "NO EMAIL";

                    return (
                      <div
                        key={member.id}
                        className="bg-[#151312] border border-white/5 rounded-sm p-3.5 flex items-center gap-3 shadow-sm hover:border-[#00ffec]/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-sm bg-[#100e0d] border border-[#00ffec]/40 text-[#00ffec] font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#e8e1df] truncate font-sans">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-[#83958d] truncate font-mono mt-0.5">
                            {email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Grade Group Link (Admin/Judge) */}
                {canGrade && (
                  <Link
                    href={`/groups/${group.id}/grading`}
                    className="px-4 py-2.5 rounded-none bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-[#00382b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>GRADE GROUP</span>
                  </Link>
                )}

                {/* View Feedbacks Link */}
                <Link
                  href={`/groups/${group.id}/feedbacks`}
                  className="px-4 py-2.5 rounded-none bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/40 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>VIEW FEEDBACKS</span>
                </Link>

                {/* Give Feedback Button */}
                {onOpenGiveFeedback && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGiveFeedback(group);
                    }}
                    className="px-4 py-2.5 rounded-none bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-white/20 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>GIVE FEEDBACK</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-none text-xs font-bold text-[#83958d] hover:text-[#e8e1df] border border-white/10 hover:border-white/20 uppercase transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GroupDetailModal;
