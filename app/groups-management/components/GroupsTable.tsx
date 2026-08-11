"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { GroupWithMembersAndEvent } from "../../types/groups";
import MembersDropdown from "./MembersDropdown";

/**
 * PURPOSE:
 * Tabular display component for rendering group records, member dropdowns, and group management actions.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to isolate table structure and row action triggers.
 *
 * INPUTS / PARAMETERS:
 * - groups (GroupWithMembersAndEvent[], Required): Array of groups joined with event and member details.
 * - onOpenEditModal (function, Required): Callback to open edit group modal.
 * - onOpenAddMemberModal (function, Required): Callback to open add member modal for a group.
 * - onDeleteGroup (function, Required): Callback to delete a group by ID.
 * - onMemberRemoved (function, Required): Callback triggered when a member is removed from a group.
 */

interface GroupsTableProps {
  groups: GroupWithMembersAndEvent[];
  onOpenEditModal: (group: GroupWithMembersAndEvent) => void;
  onOpenAddMemberModal: (group: GroupWithMembersAndEvent) => void;
  onDeleteGroup: (groupId: string) => void;
  onMemberRemoved: (groupId: string, memberRecordId: string) => void;
}

export function GroupsTable({
  groups,
  onOpenEditModal,
  onOpenAddMemberModal,
  onDeleteGroup,
  onMemberRemoved,
}: GroupsTableProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Maps over the groups array to display NO, GROUP NAME, EVENT NAME, SHORT DESCRIPTION, CREATED AT, MEMBERS & ACTIONS.
   * Renders MembersDropdown and action buttons for adding members, editing groups, and deleting groups.
   *
   * PARAMETERS:
   * - props (GroupsTableProps): Table data and action handlers.
   *
   * RETURNS:
   * - JSX.Element: Rendered HTML table component.
   */
  return (
    <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl overflow-x-auto shadow-xl">
      <table className="w-full border-collapse text-sm text-slate-200 text-left min-w-[1000px]">
        <thead>
          <tr className="border-b border-white/15 bg-[#0a1526] text-slate-300 select-none text-xs uppercase tracking-wider font-bold">
            <th className="p-4 sm:p-5 text-center w-14">NO</th>
            <th className="p-4 sm:p-5">GROUP_NAME</th>
            <th className="p-4 sm:p-5">EVENT_NAME</th>
            <th className="p-4 sm:p-5">SHORT_DESCRIPTION</th>
            <th className="p-4 sm:p-5">CREATED_AT</th>
            <th className="p-4 sm:p-5 text-center w-48">MEMBERS</th>
            <th className="p-4 sm:p-5 text-center w-52">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {groups.length > 0 ? (
              groups.map((group, index) => {
                const eventName =
                  group.events?.short_description ||
                  group.events?.location ||
                  "UNASSIGNED_EVENT";

                return (
                  <tr
                    key={group.id}
                    className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Index */}
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-400">
                      {String(index + 1).padStart(3, "0")}
                    </td>

                    {/* Group Name */}
                    <td className="p-4 sm:p-5 text-white font-bold text-base">
                      {group.group_name || "UNTITLED_GROUP"}
                    </td>

                    {/* Event Name */}
                    <td className="p-4 sm:p-5 text-sky-200 font-semibold max-w-[200px] truncate">
                      {eventName}
                    </td>

                    {/* Short Description */}
                    <td className="p-4 sm:p-5 text-slate-300 max-w-[240px] truncate">
                      {group.short_description || "N/A"}
                    </td>

                    {/* Created At */}
                    <td className="p-4 sm:p-5 text-slate-400 whitespace-nowrap">
                      {group.created_at
                        ? new Date(group.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Number of Members & Interactive Dropdown */}
                    <td className="p-4 sm:p-5 text-center w-48">
                      <MembersDropdown
                        groupId={group.id}
                        members={group.group_members || []}
                        onMemberRemoved={onMemberRemoved}
                      />
                    </td>

                    {/* Actions: Add Member, Edit Group, Delete Group */}
                    <td className="p-4 sm:p-5 text-center w-52">
                      <div className="flex items-center justify-center gap-2">
                        {/* Add Member Button */}
                        <button
                          type="button"
                          onClick={() => onOpenAddMemberModal(group)}
                          title="Add Member to Group"
                          className="px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-500/30 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          + MEMBER
                        </button>

                        {/* Edit Group Button */}
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(group)}
                          title="Edit Group Details"
                          className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/25 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          EDIT
                        </button>

                        {/* Delete Group Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteGroup(group.id)}
                          title="Delete Group"
                          className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-16 text-center text-slate-400 select-none text-base"
                >
                  NO GROUP REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export default GroupsTable;
