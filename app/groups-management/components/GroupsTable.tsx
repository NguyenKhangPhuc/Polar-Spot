"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GroupWithMembersAndEvent, GroupMember } from "../../types/groups";
import { deleteGroupMember } from "../../actions/group_members";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

interface GroupsTableProps {
  groups: GroupWithMembersAndEvent[];
  onOpenEditModal: (group: GroupWithMembersAndEvent) => void;
  onOpenAddMemberModal: (group: GroupWithMembersAndEvent) => void;
  onOpenEditMemberModal?: (member: GroupMember) => void;
  onDeleteGroup: (groupId: string) => void;
  onMemberRemoved: (groupId: string, memberRecordId: string) => void;
}

export function GroupsTable({
  groups,
  onOpenEditModal,
  onOpenAddMemberModal,
  onOpenEditMemberModal,
  onDeleteGroup,
  onMemberRemoved,
}: GroupsTableProps) {
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  // Currently expanded group ID for row accordion
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const handleRemoveMember = async (groupId: string, memberRecordId: string) => {
    if (!confirm("Are you sure you want to remove this member from the group?")) return;

    setIsOpenLoader(true);
    try {
      const { error } = await deleteGroupMember(memberRecordId);
      if (error) {
        showNotification(error || "Fail to remove group member");
        return;
      }

      showNotification("Group member removed successfully");
      onMemberRemoved(groupId, memberRecordId);
    } catch {
      showNotification("Fail to remove group member");
    } finally {
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
      <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[950px]">
        <thead>
          <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
            <th className="p-4 text-center w-14">NO</th>
            <th className="p-4 text-center w-14">EXPAND</th>
            <th className="p-4 min-w-[200px]">GROUP NAME</th>
            <th className="p-4 min-w-[200px]">EVENT NAME</th>
            <th className="p-4 text-center w-32">MEMBERS</th>
            <th className="p-4 min-w-[120px]">CREATED AT</th>
            <th className="p-4 text-center w-48">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {groups.length > 0 ? (
            groups.map((group, index) => {
              const isExpanded = expandedGroupId === group.id;
              const members = group.group_members || [];
              const memberCount = members.length;
              const eventName =
                (group.events as any)?.title ||
                group.events?.short_description ||
                group.events?.location ||
                "UNASSIGNED EVENT";

              return (
                <React.Fragment key={group.id}>
                  {/* Main Group Row */}
                  <tr
                    onClick={() => toggleExpandGroup(group.id)}
                    className={`border-b border-white/5 last:border-0 cursor-pointer transition-colors group ${
                      isExpanded ? "bg-white/[0.04]" : "hover:bg-white/[0.01]"
                    }`}
                  >
                    {/* Index */}
                    <td className="p-4 text-center font-bold text-[#83958d]">
                      {String(index + 1).padStart(3, "0")}
                    </td>

                    {/* Expand Details Icon */}
                    <td className="p-4 text-center">
                      <svg
                        className={`w-3.5 h-3.5 text-[#00ffec] mx-auto transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </td>

                    {/* Group Name (Clickable Navigation to /groups/[id]/grading) */}
                    <td className="p-4 text-[#e8e1df] font-bold max-w-[220px] truncate">
                      <Link
                        href={`/groups/${group.id}/grading`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#00ffec] hover:underline transition-colors flex items-center gap-1.5"
                        title="Grade Group"
                      >
                        <span className="truncate">{group.group_name || "UNTITLED GROUP"}</span>
                        <svg className="w-3.5 h-3.5 text-[#00ffec] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </td>

                    {/* Event Name */}
                    <td className="p-4 text-[#83958d] max-w-[200px] truncate">
                      {eventName}
                    </td>

                    {/* Member Count */}
                    <td className="p-4 text-center font-bold">
                      <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#151312] border border-[#00ffec]/20 text-[10px] text-[#00ffec]">
                        {memberCount}
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {group.created_at
                        ? new Date(group.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }).toUpperCase()
                        : "N/A"}
                    </td>

                    {/* Actions: Grade Group, Edit Group, Delete Group */}
                    <td className="p-4 text-center w-48">
                      <div className="flex items-center justify-center gap-2">
                        {/* Grade Group Link */}
                        <Link
                          href={`/groups/${group.id}/grading`}
                          onClick={(e) => e.stopPropagation()}
                          title="Grade Group"
                          className="px-2.5 py-1.5 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          GRADE
                        </Link>

                        {/* Edit Group Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditModal(group);
                          }}
                          title="Edit Group Details"
                          className="px-2.5 py-1.5 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-[#00ffec]/40 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          EDIT
                        </button>

                        {/* Delete Group Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteGroup(group.id);
                          }}
                          title="Delete Group"
                          className="p-1.5 rounded-sm bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Accordion Dropdown Section using Framer Motion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-[#100e0d] border-b border-white/5 overflow-hidden"
                      >
                        <td colSpan={7} className="p-5 sm:p-6">
                          <div className="flex flex-col gap-4 w-full">
                            {/* Group Roster Subsection Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                              <span className="text-[11px] font-mono font-bold text-[#00ffec] uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec]" />
                                GROUP MEMBERS ({memberCount})
                              </span>

                              <div className="flex items-center gap-2">
                                {/* Navigation button to Grading Page */}
                                <Link
                                  href={`/groups/${group.id}/grading`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1.5 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                >
                                  <svg className="w-3.5 h-3.5 text-[#00382b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  <span>GRADE GROUP</span>
                                </Link>

                                {/* Add Member Modal Trigger */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenAddMemberModal(group);
                                  }}
                                  className="px-2.5 py-1.5 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-[#00ffec]/40 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  + ADD MEMBER
                                </button>
                              </div>
                            </div>

                            {/* Group Members Grid or Centered Empty State */}
                            {memberCount > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {members.map((member) => {
                                  const displayName =
                                    member.member_name || member.member_email || "UNNAMED MEMBER";
                                  const emailStr = member.member_email || "NO EMAIL";

                                  return (
                                    <div
                                      key={member.id}
                                      className="bg-[#151312] border border-white/5 rounded-sm p-3 flex items-center justify-between gap-3 shadow-md hover:border-[#00ffec]/30 transition-colors"
                                    >
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-[#e8e1df] truncate">
                                          {displayName}
                                        </span>
                                        <span className="text-[10px] text-[#83958d] truncate font-mono">
                                          {emailStr}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {onOpenEditMemberModal && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onOpenEditMemberModal(member);
                                            }}
                                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[#e8e1df] border border-white/10 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer font-mono"
                                          >
                                            EDIT
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveMember(group.id, member.id);
                                          }}
                                          className="px-2 py-1 bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 text-[9px] uppercase font-bold tracking-wider rounded-sm transition-colors cursor-pointer shrink-0 font-mono"
                                        >
                                          REMOVE
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-8 text-center text-xs font-mono font-medium text-[#83958d] italic select-none">
                                NO MEMBERS REGISTERED IN THIS GROUP
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={7}
                className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
              >
                NO GROUP REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GroupsTable;
