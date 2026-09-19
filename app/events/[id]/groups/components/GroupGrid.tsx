"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import GroupCard from "./GroupCard";

interface GroupGridProps {
  groups: GroupWithMembersAndEvent[];
  onResetFilters: () => void;
  canGrade?: boolean;
  onSelectGroup: (group: GroupWithMembersAndEvent) => void;
  onOpenGiveFeedback: (group: GroupWithMembersAndEvent) => void;
}

export function GroupGrid({
  groups,
  onResetFilters,
  canGrade = false,
  onSelectGroup,
  onOpenGiveFeedback,
}: GroupGridProps) {
  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-[#1d1b1a] border border-white/5 rounded-sm p-12 text-center space-y-4 shadow-xl font-mono text-xs w-full"
      >
        <div className="w-12 h-12 rounded-sm bg-[#151312] border border-white/10 flex items-center justify-center mx-auto text-[#83958d]">
          <svg className="w-6 h-6 text-[#83958d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-sm text-[#e8e1df] font-bold font-sans">
          No pitching groups found matching your search or sort criteria.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-sm bg-[#151312] hover:bg-[#00ffec]/10 text-[#00ffec] border border-[#00ffec]/40 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-block"
        >
          CLEAR ALL FILTERS
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <AnimatePresence mode="popLayout">
        {groups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={group}
            index={index}
            canGrade={canGrade}
            onSelectGroup={onSelectGroup}
            onOpenGiveFeedback={onOpenGiveFeedback}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GroupGrid;
