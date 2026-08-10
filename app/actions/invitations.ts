import { INVITATION_STATUS } from "../types/enum";
import { InvitationInsert } from "../types/invitation";
import { createClient } from "../utils/supabase/server";

export async function createInvitation(invitation: InvitationInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('invitations').insert(invitation)
    if (error) {
        return { error: "Fail to create invitation" }
    }
    return { data, error }
}

export async function acceptInvitation(invitation: InvitationInsert, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('invitations').update({ 'status': INVITATION_STATUS.ACCEPTED }).eq('id', invitation.id!)
    if (error) {
        return { error: "Failed to accept invitation" }
    }
    const { data: groupMember, error: groupMemberError } = await supabase.from('group_members').insert({ group_id: invitation.group_id, member_id: userId })
    if (groupMemberError) {
        return { error: "Failed to create group member" }
    }
    return { data, error }
}