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
}

export function GroupCard({ group, index = 0, canGrade = false }: GroupCardProps) {
  const members = group.group_members || [];

  const createdDateStr = group.created_at
    ? new Date(group.created_at).toLocaleDateString()
    : "N/A";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="bg-[#121212] border border-white/12 rounded-md p-6 hover:border-[#3be1fe]/40 transition-colors flex flex-col justify-between space-y-5 shadow-xl font-sans"
    >
      {/* Group Header Info */}
      <div className="space-y-4">
        {/* Avatar, Title & Member Counter Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#050505] border border-white/15 shrink-0 flex items-center justify-center shadow-md">
              {group.avatar_url ? (
                <Image
                  src={group.avatar_url}
                  alt={group.group_name || "Group Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#000000] text-[#3be1fe] font-black text-lg flex items-center justify-center font-mono border border-[#3be1fe]/30">
                  {(group.group_name || "G").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-black text-white tracking-tight leading-snug truncate">
                {group.group_name || "Unnamed Group"}
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                REGISTERED STARTUP TEAM
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[#000000] text-[#3be1fe] border border-[#3be1fe]/40 shrink-0">
            {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
          </span>
        </div>

        {/* Short Description */}
        {group.short_description && (
          <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-3 bg-[#050505] p-3 rounded-md border border-white/10">
            {group.short_description}
          </p>
        )}

        {/* Metadata Badges Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>CREATED: <strong className="text-slate-200">{createdDateStr}</strong></span>
          <span className="truncate max-w-[150px]" title={group.id}>ID: <strong className="text-slate-200">{group.id.slice(0, 8)}...</strong></span>
        </div>
      </div>

      {/* Roster of Members */}
      <div className="pt-4 border-t border-white/12 space-y-3 font-mono">
        <span className="text-[10px] font-bold text-[#3be1fe] uppercase tracking-wider block">
          TEAM MEMBERS ROSTER ({members.length})
        </span>

        {members.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">
            No member profiles registered in this group yet.
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m) => {
              const fullName = m.member_name || "Member Profile";
              const email = m.member_email || "No email provided";

              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2.5 bg-[#050505] border border-white/10 rounded-md p-2.5 transition-colors hover:border-white/20"
                >
                  <div className="w-7 h-7 rounded-sm bg-[#000000] border border-[#3be1fe]/40 text-[#3be1fe] font-bold text-xs flex items-center justify-center shrink-0">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate leading-tight font-sans">
                      {fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate leading-tight">
                      {email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role-Restricted Action Button: Grade the Group (Visible ONLY for Judge & Admin) */}
      {canGrade && (
        <div className="pt-3 border-t border-white/12">
          <Link
            href={`/groups/${group.id}/grading`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>GRADE THE GROUP</span>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default GroupCard;
