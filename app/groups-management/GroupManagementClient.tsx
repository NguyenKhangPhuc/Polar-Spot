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

  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groupsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (group) =>
          (group.group_name && group.group_name.toLowerCase().includes(q)) ||
          (group.short_description && group.short_description.toLowerCase().includes(q))
      );
    }

    if (selectedEventFilter && selectedEventFilter !== "all") {
      result = result.filter((group) => group.event_id === selectedEventFilter);
    }

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
    <div className="w-full flex flex-col gap-8 select-text">
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
      <div className="flex flex-col gap-4">
        {/* Table Metrics Bar */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00ffec]" />
            <span>01 GROUP REGISTRY DATABASE</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL GROUPS: {filteredAndSortedGroups.length}
          </span>
        </div>

        <GroupsTable
          groups={filteredAndSortedGroups}
          onOpenEditModal={(group) => setEditingGroup(group)}
          onOpenAddMemberModal={(group) => setAddMemberGroup(group)}
          onOpenEditMemberModal={(member) => setEditingMember(member)}
          onDeleteGroup={handleDeleteGroup}
          onMemberRemoved={handleMemberRemoved}
        />
      </div>

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
