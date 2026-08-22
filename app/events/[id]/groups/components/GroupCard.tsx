"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";

/**
 * PURPOSE:
 * Renders a single group card displaying group avatar, name, description, total member count badge,
 * and roster of members (full_name, email).
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/[id]/groups/components/GroupGrid.tsx.
 *
 * INPUTS / PARAMETERS:
 * - group (GroupWithMembersAndEvent, Required): Group record containing joined member profiles.
 * - index (number, Optional): Row index for staggered animation delays.
 */

interface GroupCardProps {
  group: GroupWithMembersAndEvent;
  index?: number;
}

export function GroupCard({ group, index = 0 }: GroupCardProps) {
  const members = group.group_members || [];

  /**
   * BEHAVIORAL MECHANISM:
   * Maps group object properties into a responsive card layout.
   * Utilizes staggered entry delays based on index and smooth hover lift animations.
   * Renders group avatar or letter initial fallback, and maps members roster with profile full_name and email.
   *
   * PARAMETERS:
   * - props (GroupCardProps): Component props object.
   *
   * RETURNS:
   * - JSX.Element: Group card element with Framer Motion animations.
   */
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="bg-[#13243b] border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-colors flex flex-col justify-between space-y-5 shadow-xl"
    >
      {/* Group Info Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#0a1526] border border-white/20 shrink-0 flex items-center justify-center shadow-md">
              {group.avatar_url ? (
                <Image
                  src={group.avatar_url}
                  alt={group.group_name || "Group Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-sky-950 flex items-center justify-center text-cyan-300 font-black text-lg">
                  {(group.group_name || "G").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                {group.group_name || "Unnamed Group"}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                REGISTERED TEAM
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shrink-0">
            {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
          </span>
        </div>

        {/* Short Description */}
        {group.short_description && (
          <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
            {group.short_description}
          </p>
        )}
      </div>

      {/* Roster of Members */}
      <div className="pt-3 border-t border-white/10 space-y-2.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          TEAM MEMBERS ROSTER
        </span>

        {members.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">
            No member profiles registered yet.
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m) => {
              const fullName = m.member_name || "Member Profile";
              const email = m.member_email || "No email available";

              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2.5 bg-[#0a1526]/80 border border-white/10 rounded-xl p-2.5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate leading-tight">
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
    </motion.div>
  );
}

export default GroupCard;
