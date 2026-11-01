'use server';

import { revalidatePath } from "next/cache";
import { GroupInsert, GroupUpdate, GroupWithMembersAndEvent } from "../types/groups";
import { createClient } from "../utils/supabase/server";
import { getUserRole } from "./profile";
import { PROFILE_ROLE } from "../types/enum";

async function verifyAdminRole(): Promise<boolean> {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return false;
    const role = await getUserRole(user.id);
    return String(role || "").toLowerCase() === PROFILE_ROLE.ADMIN;
}

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
     * Connects to Supabase client and executes a single consolidated relational query on 'groups'
     * embedding associated 'events' metadata and child 'group_members' records.
     *
     * PARAMETERS:
     * None.
     *
     * RETURNS:
     * - Object: { data: GroupWithMembersAndEvent[] | null, error: string | null }
     */
    const supabase = await createClient();

    // 1. Fetch groups with embedded events and group_members in a single indexed query
    const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
            *,
            events (
                id,
                title,
                short_description,
                location
            ),
            group_members (
                id,
                group_id,
                member_name,
                member_email,
                created_at
            )
        `)
        .order('created_at', { ascending: false });

    if (groupsError) {
        console.error("Fail to fetch groups:", groupsError);
        return { data: null, error: "Fail to fetch groups" };
    }

    if (!groupsData || groupsData.length === 0) {
        return { data: [], error: null };
    }

    const result: GroupWithMembersAndEvent[] = groupsData.map((group) => ({
        ...group,
        group_members: group.group_members || [],
    }));

    return { data: result, error: null };
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
     * Validates admin role, inserts the group record into Supabase, and revalidates cache.
     *
     * PARAMETERS:
     * - group (GroupInsert): Group insertion payload.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').insert(group).select().single();
    if (error) {
        return { data: null, error: "Fail to create group" };
    }
    revalidatePath('/groups-management');
    if (group.event_id) {
        revalidatePath(`/events/${group.event_id}/groups`);
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
 * - group (GroupUpdate, Required): Group record update payload containing target ID.
 */
export async function updateGroup(group: GroupUpdate) {
    /**
     * BEHAVIORAL MECHANISM:
     * Validates admin role, updates matching group record by ID in Supabase, and revalidates cache.
     *
     * PARAMETERS:
     * - group (GroupUpdate): Group payload with valid ID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').update(group).eq('id', group.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update group" };
    }
    revalidatePath('/groups-management');
    if (group.event_id) {
        revalidatePath(`/events/${group.event_id}/groups`);
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
     * Validates admin role, removes the group record matching groupId from Supabase database, and revalidates cache.
     *
     * PARAMETERS:
     * - groupId (string): Target group UUID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').delete().eq('id', groupId);
    if (error) {
        return { data: null, error: "Fail to delete group" };
    }
    revalidatePath('/groups-management');
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
     * Queries 'groups' table filtered by event_id with embedded relational joins for
     * associated 'events' metadata and child 'group_members' records in a single query.
     *
     * PARAMETERS:
     * - eventId (string): Target event UUID.
     *
     * RETURNS:
     * - Object: { data: GroupWithMembersAndEvent[] | null, error: string | null }
     */
    const supabase = await createClient();

    // 1. Fetch groups matching event_id with embedded events and group_members
    const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
            *,
            events (
                id,
                short_description,
                location
            ),
            group_members (
                id,
                group_id,
                member_name,
                member_email,
                created_at
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

    const result: GroupWithMembersAndEvent[] = groupsData.map((g) => ({
        ...g,
        group_members: g.group_members || [],
    }));

    return { data: result, error: null };
}

