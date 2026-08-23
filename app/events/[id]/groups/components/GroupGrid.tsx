"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import GroupCard from "./GroupCard";
import { ProfileInsert } from "@/app/types/profile";

interface GroupGridProps {
  groups: GroupWithMembersAndEvent[];
  onResetFilters: () => void;
  canGrade?: boolean;
  profile: ProfileInsert
}

export function GroupGrid({ groups, onResetFilters, canGrade = false, profile }: GroupGridProps) {
  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121212] border border-white/12 rounded-md p-12 text-center space-y-4 shadow-xl font-mono text-xs"
      >
        <p className="text-sm text-slate-300 font-bold font-sans">
          No pitching groups found matching your search or sort criteria.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-md bg-[#000000] hover:bg-[#18181b] text-[#3be1fe] border border-[#3be1fe]/40 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          CLEAR ALL FILTERS
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {groups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={group}
            index={index}
            canGrade={canGrade}
            profile={profile}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GroupGrid;
