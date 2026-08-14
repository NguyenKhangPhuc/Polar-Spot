'use server';

import { GroupInsert, GroupWithMembersAndEvent } from "../types/groups";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches all group records joined with associated event details and group member profiles.
 *
 * CONTEXT/PARENT FILE:
 * Called concurrently by app/groups-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export async function getAllGroupsWithMembersWithEvent() {
    /**
     * BEHAVIORAL MECHANISM:
     * Connects to Supabase client, queries 'groups' table joining 'events', fetches corresponding
     * 'group_members' records and matches user 'profiles' by member_id.
     *
     * PARAMETERS:
     * None.
     *
     * RETURNS:
     * - Object: { data: GroupWithMembersAndEvent[] | null, error: string | null }
     */
    const supabase = await createClient();

    // 1. Fetch groups with events relation
    const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
            *,
            events (
                id,
                short_description,
                location
            )
        `)
        .order('created_at', { ascending: false });

    if (groupsError) {
        console.log(groupsError)
        return { data: null, error: "Fail to fetch groups" };
    }

    // 2. Fetch all group_members records
    const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('id, group_id, member_id, created_at');

    if (membersError) {
        return { data: null, error: "Fail to fetch group members" };
    }

    // 3. Extract unique member IDs to fetch profiles
    const memberIds = Array.from(
        new Set(
            (membersData || [])
                .map((m) => m.member_id)
                .filter((id): id is string => Boolean(id))
        )
    );

    let profilesMap: Record<string, { id: string; email: string | null; full_name: string | null }> = {};

    if (memberIds.length > 0) {
        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', memberIds);

        if (profilesData) {
            profilesData.forEach((p) => {
                profilesMap[p.id] = p;
            });
        }
    }

    // 4. Assemble joined result
    const joinedGroups: GroupWithMembersAndEvent[] = groupsData.map((group) => {
        const groupMembers = (membersData || [])
            .filter((m) => m.group_id === group.id)
            .map((m) => ({
                id: m.id,
                group_id: m.group_id || group.id,
                member_id: m.member_id || "",
                created_at: m.created_at,
                profiles: m.member_id && profilesMap[m.member_id] ? profilesMap[m.member_id] : null,
            }));

        return {
            ...group,
            events: group.events ? (group.events as any) : null,
            group_members: groupMembers,
        };
    });

    return { data: joinedGroups, error: null };
}

/**
 * PURPOSE:
 * Fetches a single group record by its unique group ID.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/groups/[id]/grading/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 */
export async function getGroupByGroupId(groupId: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * Queries Supabase 'groups' table filtering by id equal to groupId and returns single group record.
     *
     * PARAMETERS:
     * - groupId (string): Target group UUID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

    if (error) {
        return { data: null, error: "Fail to fetch group" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Inserts a new group record into the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by CreateGroupModal component in app/groups-management/components/CreateGroupModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - group (GroupInsert, Required): Group payload to insert.
 */
export async function createGroup(group: GroupInsert) {
    /**
     * BEHAVIORAL MECHANISM:
     * Inserts the group record into Supabase and returns the newly created record.
     *
     * PARAMETERS:
     * - group (GroupInsert): Group insertion payload.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').insert(group).select().single();
    if (error) {
        return { data: null, error: "Fail to create group" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Updates an existing group record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by EditGroupModal component in app/groups-management/components/EditGroupModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - group (GroupInsert, Required): Group record update payload containing target ID.
 */
export async function updateGroup(group: GroupInsert) {
    /**
     * BEHAVIORAL MECHANISM:
     * Updates matching group record by ID in Supabase and returns the updated record.
     *
     * PARAMETERS:
     * - group (GroupInsert): Group payload with valid ID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').update(group).eq('id', group.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update group" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Deletes a group record from the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by delete action in GroupsTable.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of the group to delete.
 */
export async function deleteGroup(groupId: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * Removes the group record matching groupId from Supabase database.
     *
     * PARAMETERS:
     * - groupId (string): Target group UUID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').delete().eq('id', groupId);
    if (error) {
        return { data: null, error: "Fail to delete group" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Fetches all groups registered for a specific eventId, joining group_members and user profiles.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/events/[id]/groups/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of target event.
 */
export async function getGroupsByEventId(eventId: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * Queries 'groups' table filtered by event_id, fetches associated 'group_members' records,
     * extracts unique member_ids to query user 'profiles', and maps profile data to each member.
     *
     * PARAMETERS:
     * - eventId (string): Target event UUID.
     *
     * RETURNS:
     * - Object: { data: GroupWithMembersAndEvent[] | null, error: string | null }
     */
    const supabase = await createClient();

    // 1. Fetch groups matching event_id
    const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
            *,
            events (
                id,
                short_description,
                location
            )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

    if (groupsError) {
        return { data: null, error: "Fail to fetch event groups" };
    }

    if (!groupsData || groupsData.length === 0) {
        return { data: [], error: null };
    }

    const groupIds = groupsData.map((g) => g.id);

    // 2. Fetch group_members for these groups
    const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('id, group_id, member_id, created_at')
        .in('group_id', groupIds);

    if (membersError) {
        return { data: null, error: "Fail to fetch group members" };
    }

    // 3. Extract unique member_ids and fetch profiles
    const memberIds = Array.from(
        new Set(
            (membersData || [])
                .map((m) => m.member_id)
                .filter((id): id is string => typeof id === "string" && id.length > 0)
        )
    );

    const profilesMap: Record<string, { id: string; email: string | null; full_name: string | null; avatar_url?: string | null }> = {};

    if (memberIds.length > 0) {
        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .in('id', memberIds);

        (profilesData || []).forEach((p) => {
            profilesMap[p.id] = p;
        });
    }

    // 4. Map members to their groups
    const membersByGroup: Record<string, any[]> = {};
    (membersData || []).forEach((m) => {
        if (!m.group_id) return;
        if (!membersByGroup[m.group_id]) {
            membersByGroup[m.group_id] = [];
        }
        const profile = m.member_id ? profilesMap[m.member_id] || null : null;
        membersByGroup[m.group_id].push({
            ...m,
            profiles: profile,
        });
    });

    const result: GroupWithMembersAndEvent[] = groupsData.map((g) => ({
        ...g,
        group_members: membersByGroup[g.id] || [],
    }));

    return { data: result, error: null };
}

