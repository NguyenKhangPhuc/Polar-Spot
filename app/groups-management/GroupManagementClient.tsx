"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Event } from "../types/event";
import { GroupWithMembersAndEvent, GroupMember } from "../types/groups";
import { deleteGroup } from "../actions/groups";
import { useLoader } from "../context/LoaderContext";
import { useNotification } from "../context/NotificationContext";

import HeaderSection from "./components/HeaderSection";
import GroupFilterControls from "./components/GroupFilterControls";
import GroupsTable from "./components/GroupsTable";
import CreateGroupModal from "./components/CreateGroupModal";
import EditGroupModal from "./components/EditGroupModal";
import AddMemberModal from "./components/AddMemberModal";
import EditMemberModal from "./components/EditMemberModal";

type SortOrder = "asc" | "desc";

/**
 * PURPOSE:
 * Orchestrator client component for the Groups Management dashboard. Manages state for group records,
 * text searching, event filtering, title sorting, modal visibility, and delegating UI rendering to modular sub-components.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/groups-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - initialGroups (GroupWithMembersAndEvent[], Required): Initial list of groups joined with event and member info.
 * - eventsList (Event[], Required): List of all events available for group assignment.
 */

interface GroupManagementClientProps {
  initialGroups: GroupWithMembersAndEvent[];
  eventsList: Event[];
}

export default function GroupManagementClient({
  initialGroups,
  eventsList,
}: GroupManagementClientProps) {
  const router = useRouter();
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  // Local state
  const [groupsList, setGroupsList] = useState<GroupWithMembersAndEvent[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Modal open states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupWithMembersAndEvent | null>(null);
  const [addMemberGroup, setAddMemberGroup] = useState<GroupWithMembersAndEvent | null>(null);
  const [editingMember, setEditingMember] = useState<GroupMember | null>(null);

  /**
   * BEHAVIORAL MECHANISM:
   * Memoized computation to filter groups by group_name text search and target event ID,
   * then sorts by group_name in ascending or descending order.
   *
   * PARAMETERS:
   * None (uses state variables groupsList, searchQuery, selectedEventFilter, sortOrder).
   *
   * RETURNS:
   * - GroupWithMembersAndEvent[]: Filtered and sorted groups array.
   */
  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groupsList];

    // 1. Search filter by group_name or short_description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (group) =>
          (group.group_name && group.group_name.toLowerCase().includes(q)) ||
          (group.short_description && group.short_description.toLowerCase().includes(q))
      );
    }

    // 2. Event filter
    if (selectedEventFilter && selectedEventFilter !== "all") {
      result = result.filter((group) => group.event_id === selectedEventFilter);
    }

    // 3. Sorting by group_name
    result.sort((a, b) => {
      const nameA = (a.group_name || "").toLowerCase();
      const nameB = (b.group_name || "").toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return result;
  }, [groupsList, searchQuery, selectedEventFilter, sortOrder]);

  /**
   * BEHAVIORAL MECHANISM:
   * Deletes a group by ID using deleteGroup server action after user confirmation.
   * Triggers global loader spinner and toast notification on success/error.
   *
   * PARAMETERS:
   * - groupId (string): Unique identifier of target group to delete.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    setIsOpenLoader(true);
    try {
      const { error } = await deleteGroup(groupId);
      if (error) {
        showNotification(error || "Fail to delete group");
        return;
      }

      showNotification("Group deleted successfully");
      setGroupsList((prev) => prev.filter((g) => g.id !== groupId));
      router.refresh();
    } catch {
      showNotification("Fail to delete group");
    } finally {
      setIsOpenLoader(false);
    }
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Updates local groups state when a member is removed from a group's roster.
   *
   * PARAMETERS:
   * - groupId (string): Target group UUID.
   * - memberRecordId (string): Removed group_members record ID.
   *
   * RETURNS:
   * - void
   */
  const handleMemberRemoved = (groupId: string, memberRecordId: string) => {
    setGroupsList((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            group_members: g.group_members.filter((m) => m.id !== memberRecordId),
          };
        }
        return g;
      })
    );
    router.refresh();
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Updates local groups state when a new member is added to a group.
   *
   * PARAMETERS:
   * - groupId (string): Target group UUID.
   * - newMemberRecord (GroupMemberWithProfile): Newly created member record with profile data.
   *
   * RETURNS:
   * - void
   */
  const handleMemberAdded = (groupId: string, newMemberRecord: GroupMember) => {
    setGroupsList((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            group_members: [...g.group_members, newMemberRecord],
          };
        }
        return g;
      })
    );
    router.refresh();
  };

  const handleMemberUpdated = (updatedMemberRecord: GroupMember) => {
    setGroupsList((prev) =>
      prev.map((g) => {
        if (g.id === updatedMemberRecord.group_id) {
          return {
            ...g,
            group_members: g.group_members.map((m) =>
              m.id === updatedMemberRecord.id ? updatedMemberRecord : m
            ),
          };
        }
        return g;
      })
    );
    router.refresh();
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Callback invoked when a group is created or updated via modal dialogs.
   * Updates local state and triggers router refresh.
   */
  const handleGroupCreated = (newGroup: GroupWithMembersAndEvent) => {
    setGroupsList((prev) => [newGroup, ...prev]);
    router.refresh();
  };

  const handleGroupUpdated = (updatedGroup: GroupWithMembersAndEvent) => {
    setGroupsList((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
    router.refresh();
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100">
      {/* Top Section Header */}
      <HeaderSection onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Search Bar & Filter Controls */}
      <GroupFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedEventFilter={selectedEventFilter}
        setSelectedEventFilter={setSelectedEventFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        eventsList={eventsList}
      />

      {/* Tabular Display of Groups */}
      <GroupsTable
        groups={filteredAndSortedGroups}
        onOpenEditModal={(group) => setEditingGroup(group)}
        onOpenAddMemberModal={(group) => setAddMemberGroup(group)}
        onOpenEditMemberModal={(member) => setEditingMember(member)}
        onDeleteGroup={handleDeleteGroup}
        onMemberRemoved={handleMemberRemoved}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventsList={eventsList}
        onGroupCreated={handleGroupCreated}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        group={editingGroup}
        isOpen={Boolean(editingGroup)}
        onClose={() => setEditingGroup(null)}
        eventsList={eventsList}
        onGroupUpdated={handleGroupUpdated}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        group={addMemberGroup}
        isOpen={Boolean(addMemberGroup)}
        onClose={() => setAddMemberGroup(null)}
        onMemberAdded={handleMemberAdded}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        member={editingMember}
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        onMemberUpdated={handleMemberUpdated}
      />
    </div>
  );
}
