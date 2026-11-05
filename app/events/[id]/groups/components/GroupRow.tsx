"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GroupWithMembersAndEvent } from "@/app/types/groups";

interface GroupRowProps {
  group: GroupWithMembersAndEvent;
  canGrade?: boolean;
  canGiveFeedback?: boolean;
  isAdmin?: boolean;
  onSelectGroup: (group: GroupWithMembersAndEvent) => void;
  onOpenGiveFeedback: (group: GroupWithMembersAndEvent) => void;
}

export function GroupRow({
  group,
  canGrade = true,
  canGiveFeedback = true,
  isAdmin = false,
  onSelectGroup,
  onOpenGiveFeedback,
}: GroupRowProps) {
  const members = group.group_members || [];

  const createdDateStr = group.created_at
    ? new Date(group.created_at).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
    : "N/A";

  return (
    <div
      onClick={() => onSelectGroup(group)}
      className="bg-[#1d1b1a] border border-white/5 hover:border-[#00ffec]/40 hover:bg-[#22201e] rounded-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-all cursor-pointer group select-none relative"
    >
      {/* Left: Avatar, Group Name & Meta */}
      <div className="flex items-center gap-3.5 min-w-0 md:w-1/3">
        <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-[#151312] border border-white/10 shrink-0 flex items-center justify-center shadow-md">
          {group.avatar_url ? (
            <Image
              src={group.avatar_url}
              alt={group.group_name || "Group Avatar"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#100e0d] text-[#00ffec] font-black text-sm flex items-center justify-center font-mono border border-[#00ffec]/30">
              {(group.group_name || "G").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[#e8e1df] group-hover:text-[#00ffec] tracking-tight truncate transition-colors font-sans">
            {group.group_name || "Unnamed Group"}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 font-mono text-[9px] text-[#83958d]">
            <span>{createdDateStr}</span>
            <span>•</span>
            <span className="text-[#00ffec] font-bold">
              {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Compact Description (Truncated summary) */}
      <div className="min-w-0 flex-1 md:px-4">
        <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans line-clamp-2 md:line-clamp-1">
          {group.short_description || "No pitch description provided."}
        </p>
      </div>

      {/* Right: Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center flex-wrap md:flex-nowrap gap-2 shrink-0 font-mono text-[10px]"
      >
        {canGrade && (
          <Link
            href={`/groups/${group.id}/grading`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center whitespace-nowrap"
          >
            GRADE
          </Link>
        )}

        {canGiveFeedback && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenGiveFeedback(group);
            }}
            className="px-3 py-2 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-white/20 font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center whitespace-nowrap"
          >
            FEEDBACK
          </button>
        )}

        {isAdmin && (
          <Link
            href={`/groups/${group.id}/feedbacks`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#00ffec] border border-[#00ffec]/30 font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center whitespace-nowrap"
          >
            FEEDBACKS
          </Link>
        )}
      </div>
    </div>
  );
}

export default GroupRow;
