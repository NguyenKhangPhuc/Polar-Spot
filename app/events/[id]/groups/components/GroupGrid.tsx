"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GroupWithMembersAndEvent } from "@/app/types/groups";
import GroupCard from "./GroupCard";

/**
 * PURPOSE:
 * Renders registered pitching groups in a 2-column grid layout (2 groups per row on md/lg screens)
 * with Framer Motion AnimatePresence mode popLayout transitions or empty state feedback.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent rendered by app/events/[id]/groups/components/EventGroupsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groups (GroupWithMembersAndEvent[], Required): Array of processed group records.
 * - onResetFilters (function, Required): Callback triggered when user clicks clear filters button.
 */

interface GroupGridProps {
  groups: GroupWithMembersAndEvent[];
  onResetFilters: () => void;
}

export function GroupGrid({ groups, onResetFilters }: GroupGridProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Checks if groups array contains elements. If empty, renders an animated empty state container.
   * Otherwise renders a 2-column grid (grid-cols-1 md:grid-cols-2 gap-6) wrapped inside AnimatePresence for filter transitions.
   *
   * PARAMETERS:
   * - props (GroupGridProps): Component parameters object.
   *
   * RETURNS:
   * - JSX.Element: Animated group grid or empty state element.
   */
  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#13243b] border border-white/20 rounded-2xl p-12 text-center space-y-3 shadow-xl backdrop-blur-md"
      >
        <p className="text-base text-slate-300 font-semibold">
          No pitching groups found matching your search or sort criteria.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
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
          <GroupCard key={group.id} group={group} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GroupGrid;
