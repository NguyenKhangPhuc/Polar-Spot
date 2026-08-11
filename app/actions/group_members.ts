'use server';

import { GroupMemberInsert } from "../types/group_members";
import { GroupMemberWithProfile } from "../types/groups";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Deletes a group member record from the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by MembersDropdown component inside app/groups-management/components/MembersDropdown.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupMemberId (string, Required): Unique identifier of the group member record to remove.
 */
export async function deleteGroupMember(groupMemberId: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * Removes the group_members record matching groupMemberId from Supabase.
     *
     * PARAMETERS:
     * - groupMemberId (string): Target group member record UUID.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('group_members').delete().eq('id', groupMemberId);
    if (error) {
        return { data: null, error: "Fail to delete group member" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Adds a new member to a group by looking up their user profile email.
 *
 * CONTEXT/PARENT FILE:
 * Called by AddMemberModal component inside app/groups-management/components/AddMemberModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of the target group.
 * - email (string, Required): Email address of the user profile to add.
 */
export async function addGroupMemberByEmail(groupId: string, email: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * 1. Sanitizes email and queries 'profiles' table for matching user profile.
     * 2. Checks if profile exists; if not, returns an error.
     * 3. Checks if user is already a member of the group.
     * 4. Inserts new record into 'group_members' table linking group_id and member_id (profile.id).
     *
     * PARAMETERS:
     * - groupId (string): Target group UUID.
     * - email (string): Email of the member to add.
     *
     * RETURNS:
     * - Object: { data: GroupMemberWithProfile | null, error: string | null }
     */
    const supabase = await createClient();
    const sanitizedEmail = email.toLowerCase().trim();

    // Query user profile by email
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', sanitizedEmail)
        .maybeSingle();

    if (profileError || !profile) {
        return { data: null, error: "Fail to find user with provided email" };
    }

    // Check if already a member
    const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('member_id', profile.id)
        .maybeSingle();

    if (existingMember) {
        return { data: null, error: "User is already a member of this group" };
    }

    // Insert new group member record
    const { data: newMember, error: insertError } = await supabase
        .from('group_members')
        .insert({
            group_id: groupId,
            member_id: profile.id,
        })
        .select()
        .single();

    if (insertError || !newMember) {
        return { data: null, error: "Fail to add group member" };
    }

    const memberWithProfile: GroupMemberWithProfile = {
        id: newMember.id,
        group_id: newMember.group_id || groupId,
        member_id: newMember.member_id || profile.id,
        created_at: newMember.created_at,
        profiles: profile,
    };

    return { data: memberWithProfile, error: null };
}

/**
 * PURPOSE:
 * Directly inserts a group member record using GroupMemberInsert payload.
 *
 * CONTEXT/PARENT FILE:
 * Called by group membership management helpers.
 *
 * INPUTS / PARAMETERS:
 * - groupMember (GroupMemberInsert, Required): Payload containing group_id and member_id.
 */
export async function addGroupMember(groupMember: GroupMemberInsert) {
    /**
     * BEHAVIORAL MECHANISM:
     * Inserts raw group_members record into Supabase.
     *
     * PARAMETERS:
     * - groupMember (GroupMemberInsert): Insert payload.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('group_members').insert(groupMember).select().single();
    if (error) {
        return { data: null, error: "Fail to create group member" };
    }
    return { data, error: null };
}
