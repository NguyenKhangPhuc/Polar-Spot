"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";

interface GroupCardProps {
  group: GroupWithMembersAndEvent;
  index?: number;
  canGrade?: boolean;
  onSelectGroup: (group: GroupWithMembersAndEvent) => void;
  onOpenGiveFeedback: (group: GroupWithMembersAndEvent) => void;
}

export function GroupCard({
  group,
  index = 0,
  canGrade = false,
  onSelectGroup,
  onOpenGiveFeedback,
}: GroupCardProps) {
  const members = group.group_members || [];

  const createdDateStr = group.created_at
    ? new Date(group.created_at).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
    : "N/A";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25), ease: "easeOut" }}
      onClick={() => onSelectGroup(group)}
      className="bg-[#1d1b1a] border border-white/5 hover:border-[#00ffec]/40 hover:bg-[#22201e] rounded-sm p-6 flex flex-col justify-between gap-5 shadow-xl transition-all cursor-pointer group select-none relative"
    >
      {/* Top Header & Overview */}
      <div className="space-y-4">
        {/* Avatar, Title & Member Counter Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-[#151312] border border-white/10 shrink-0 flex items-center justify-center shadow-md">
              {group.avatar_url ? (
                <Image
                  src={group.avatar_url}
                  alt={group.group_name || "Group Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#100e0d] text-[#00ffec] font-black text-base flex items-center justify-center font-mono border border-[#00ffec]/30">
                  {(group.group_name || "G").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#e8e1df] group-hover:text-[#00ffec] tracking-tight leading-snug truncate transition-colors font-sans">
                {group.group_name || "Unnamed Group"}
              </h3>
              <span className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-wider block mt-0.5">
                REGISTERED STARTUP TEAM
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider bg-[#151312] text-[#00ffec] border border-[#00ffec]/30 shrink-0">
            {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
          </span>
        </div>

        {/* Short Description */}
        {group.short_description ? (
          <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans line-clamp-3 bg-[#151312] p-3.5 rounded-sm border border-white/5">
            {group.short_description}
          </p>
        ) : (
          <p className="text-xs text-[#83958d] italic bg-[#151312] p-3 rounded-sm border border-white/5">
            No pitch description provided.
          </p>
        )}

        {/* Created Date Bar (NO group id) */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#83958d] pt-1 border-t border-white/5">
          <span>
            CREATED: <strong className="text-[#e8e1df] font-bold">{createdDateStr}</strong>
          </span>
          <span className="text-[9px] text-[#00ffec] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            VIEW DETAILS &amp; VIDEO &rarr;
          </span>
        </div>
      </div>

      {/* Roster of Members */}
      <div className="pt-3 border-t border-white/5 space-y-2.5 font-mono">
        <span className="text-[9px] font-bold text-[#00ffec] uppercase tracking-wider block flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec]" />
          TEAM MEMBERS ({members.length})
        </span>

        {members.length === 0 ? (
          <div className="text-xs text-[#83958d] italic py-1.5 font-sans">
            No member profiles registered yet.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {members.slice(0, 3).map((m) => {
              const fullName = m.member_name || m.member_email || "Member Profile";
              const email = m.member_email || "No email provided";

              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2.5 bg-[#151312] border border-white/5 rounded-sm p-2 transition-colors"
                >
                  <div className="w-6 h-6 rounded-sm bg-[#100e0d] border border-[#00ffec]/30 text-[#00ffec] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#e8e1df] truncate leading-tight font-sans">
                      {fullName}
                    </p>
                    <p className="text-[10px] text-[#83958d] truncate leading-tight">
                      {email}
                    </p>
                  </div>
                </div>
              );
            })}

            {members.length > 3 && (
              <p className="text-[10px] text-[#83958d] text-center pt-0.5">
                +{members.length - 3} more members...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="pt-3 border-t border-white/5 space-y-2 font-mono">
        {/* Row 1: Grade Group (Admin/Judge) + Give Feedback */}
        {canGrade ? (
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={`/groups/${group.id}/grading`}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center"
            >
              <svg className="w-3.5 h-3.5 text-[#00382b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="truncate">GRADE</span>
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGiveFeedback(group);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-white/20 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center"
            >
              <svg className="w-3.5 h-3.5 text-[#00ffec] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="truncate">FEEDBACK</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenGiveFeedback(group);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-white/20 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center"
          >
            <svg className="w-3.5 h-3.5 text-[#00ffec] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="truncate">GIVE FEEDBACK</span>
          </button>
        )}

        {/* Row 2: View Group Feedbacks */}
        <Link
          href={`/groups/${group.id}/feedbacks`}
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-none bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/30 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center"
        >
          <svg className="w-3.5 h-3.5 text-[#00ffec] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="truncate">VIEW GROUP FEEDBACKS</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default GroupCard;
