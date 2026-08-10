import { GroupMemberInsert } from "../types/group_members";
import { createClient } from "../utils/supabase/server";

export async function deleteGroupMember(groupMemberId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('group_members').delete().eq('id', groupMemberId)
    if (error) {
        return { error: "Failed to delete group member" }
    }
    return { data, error }
}

export async function addGroupMember(groupMember: GroupMemberInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('group_members').insert(groupMember)
    if (error) {
        return { error: "Failed to create group member" }
    }
    return { data, error }
}
