import { INVITATION_STATUS } from "../types/enum";
import { RegisterGroupMember } from "../types/group_members";
import { GroupInsert } from "../types/groups";
import { InvitationInsert } from "../types/invitation";
import { createClient } from "../utils/supabase/server";

export async function createGroup(registerGroupMemberData: RegisterGroupMember) {
    const supabase = await createClient()
    const filteredOutEmails = registerGroupMemberData.member_emails.filter((value) => value != null).splice(1)
    const { data, error } = await supabase.from('profiles').select('email').in('email', filteredOutEmails);
    if ((data?.length == 0 && filteredOutEmails.length != 0) || error) {
        return { error: "Fail to verify member email" }
    }

    const { data: createdGroup, error: groupError } = await supabase.from('groups').insert([{
        group_name: registerGroupMemberData.title,
        short_description: registerGroupMemberData.short_description,
        event_id: registerGroupMemberData.event_id,
    }]).select().single()

    if (groupError) {
        return { error: 'Fail to create group' }
    }

    const { data: createdMember, error: memberError } = await supabase.from('group_members').insert([{
        group_id: createdGroup.id,
        member_id: registerGroupMemberData.user_id
    }])

    if (memberError) {
        await supabase.from('groups').delete().eq('id', createdGroup.id);
        return { error: 'Fail to add member to group' }
    }

    if (filteredOutEmails.length == 0) {
        return { createdGroup, error: groupError }
    }

    const invitations: Array<InvitationInsert> = filteredOutEmails.map((value) => {
        return { group_id: createdGroup.id, member_email: value.toLowerCase().trim(), invitation_status: INVITATION_STATUS.PENDING }
    })

    const { data: createdInvitation, error: invitationError } = await supabase.from('invitations').insert(invitations)

    if (invitationError) {
        return { error: 'Fail to send invitation' }
    }
    return { createdGroup, error: groupError }
}

export async function updateGroup(group: GroupInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('groups').update(group).eq('id', group.id!)
    if (error) {
        return { error: "Fail to update group" }
    }
    return { data, error }
}

export async function deleteGroup(groupId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('groups').delete().eq('id', groupId)

    if (error) {
        return { error: "Fail to delete group" }
    }
    return { data, error }
}
