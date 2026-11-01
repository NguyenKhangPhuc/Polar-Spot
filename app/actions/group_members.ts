'use server';

import { revalidatePath } from "next/cache";
import { GroupMemberInsert } from "../types/group_members";
import { GroupMember } from "../types/groups";
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
 * Deletes a group member record from the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by MembersDropdown component inside app/groups-management/components/MembersDropdown.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupMemberId (string, Required): Unique identifier of the group member record to remove.
 */
export async function deleteGroupMember(groupMemberId: string) {
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('group_members').delete().eq('id', groupMemberId);
    if (error) {
        return { data: null, error: "Fail to delete group member" };
    }
    revalidatePath('/groups-management');
    return { data, error: null };
}

/**
 * PURPOSE:
 * Directly creates a group member with email and name without profile lookup.
 *
 * CONTEXT/PARENT FILE:
 * Called by AddMemberModal component inside app/groups-management/components/AddMemberModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 * - memberName (string, Required): Full name of the member.
 * - memberEmail (string, Required): Email address of the member.
 */
export async function createGroupMemberDirectly(groupId: string, memberName: string, memberEmail: string) {
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const sanitizedEmail = memberEmail.toLowerCase().trim();
    const sanitizedName = memberName.trim();

    const { data: newMember, error } = await supabase
        .from('group_members')
        .insert({
            group_id: groupId,
            member_name: sanitizedName,
            member_email: sanitizedEmail,
        })
        .select()
        .single();

    if (error || !newMember) {
        console.error("Failed to add group member:", error);
        return { data: null, error: "Fail to add group member" };
    }

    revalidatePath('/groups-management');
    return { data: newMember as GroupMember, error: null };
}

/**
 * PURPOSE:
 * Directly inserts a group member record using GroupMemberInsert payload.
 *
 * CONTEXT/PARENT FILE:
 * Called by group membership management helpers.
 *
 * INPUTS / PARAMETERS:
 * - groupMember (GroupMemberInsert, Required): Payload containing group_id, member_name, and member_email.
 */
export async function addGroupMember(groupMember: GroupMemberInsert) {
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('group_members').insert(groupMember).select().single();
    if (error) {
        return { data: null, error: "Fail to create group member" };
    }
    revalidatePath('/groups-management');
    return { data: data as GroupMember, error: null };
}

/**
 * PURPOSE:
 * Updates a group member record's member_name and member_email.
 *
 * CONTEXT/PARENT FILE:
 * Called by EditMemberModal component inside app/groups-management/components/EditMemberModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupMemberId (string, Required): Unique identifier of the target group_members record.
 * - memberName (string, Required): Updated full name of member.
 * - memberEmail (string, Required): Updated email address of member.
 */
export async function updateGroupMember(groupMemberId: string, memberName: string, memberEmail: string) {
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
        return { data: null, error: "Unauthorized: admin role required" };
    }

    const supabase = await createClient();
    const sanitizedEmail = memberEmail.toLowerCase().trim();
    const sanitizedName = memberName.trim();

    const { data: updatedMember, error } = await supabase
        .from('group_members')
        .update({
            member_name: sanitizedName,
            member_email: sanitizedEmail,
        })
        .eq('id', groupMemberId)
        .select()
        .single();

    if (error || !updatedMember) {
        console.error("Failed to update group member:", error);
        return { data: null, error: "Fail to update group member" };
    }

    revalidatePath('/groups-management');
    return { data: updatedMember as GroupMember, error: null };
}
