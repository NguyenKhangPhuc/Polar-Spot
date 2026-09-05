"use client";

import React, { useState } from "react";
import { GroupMemberWithProfile } from "../../types/groups";
import { deleteGroupMember } from "../../actions/group_members";

/**
 * PURPOSE:
 * Interactive dropdown component listing all members of a group with an inline 'Remove' action for each member.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to encapsulate group roster inspection and member removal logic.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of the group.
 * - members (GroupMemberWithProfile[], Required): Array of member records with nested user profile info.
 * - onMemberRemoved (function, Required): Callback triggered after a member is successfully deleted.
 */

interface MembersDropdownProps {
  groupId: string;
  members: GroupMemberWithProfile[];
  onMemberRemoved: (groupId: string, memberRecordId: string) => void;
}

export function MembersDropdown({
  groupId,
  members,
  onMemberRemoved,
}: MembersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  /**
   * BEHAVIORAL MECHANISM:
   * Calls deleteGroupMember server action to remove the selected member from the group_members table.
   * Disables button during execution and notifies parent on success.
   *
   * PARAMETERS:
   * - memberRecordId (string): Unique identifier of the group_members table entry.
   *
   * RETURNS:
   * - Promise<void>: Asynchronous removal execution.
   */
  const handleRemoveMember = async (memberRecordId: string) => {
    setRemovingId(memberRecordId);
    const { error } = await deleteGroupMember(memberRecordId);
    setRemovingId(null);

    if (error) {
      alert(error || "Fail to remove group member");
      return;
    }

    onMemberRemoved(groupId, memberRecordId);
  };

  return (
    <div className="relative inline-block text-left font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-sm bg-[#151312] border border-white/10 text-xs font-bold text-[#e8e1df] hover:border-[#00ffec]/40 transition-colors cursor-pointer"
      >
        <span>
          {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#00ffec] transition-transform ${
            isOpen ? "rotate-180" : ""
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
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay to close dropdown on click outside */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-72 bg-[#1d1b1a] border border-white/10 rounded-sm shadow-2xl z-30 p-2 space-y-1.5 max-h-60 overflow-y-auto">
            {members.length > 0 ? (
              members.map((member) => {
                const displayName =
                  member.member_name || member.member_email || "Unnamed Member";
                const isRemoving = removingId === member.id;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-sm bg-[#151312] hover:bg-white/5 border border-white/10 transition-colors"
                  >
                    <div className="flex flex-col truncate min-w-0">
                      <span className="text-xs font-bold text-[#e8e1df] truncate">
                        {displayName}
                      </span>
                      {member.member_email && (
                        <span className="text-[10px] text-[#83958d] truncate">
                          {member.member_email}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => handleRemoveMember(member.id)}
                      className="px-2 py-1 rounded-sm text-[10px] font-bold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 transition-colors uppercase shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isRemoving ? "REMOVING..." : "REMOVE"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-[#83958d]">
                NO MEMBERS IN GROUP
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MembersDropdown;
