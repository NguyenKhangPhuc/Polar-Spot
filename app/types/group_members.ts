import { Database } from "./database.types"


export interface RegisterGroupMember {
    title: string;
    member_emails: string[]
    event_id: string;
    user_id: string;
    short_description: string;
}

export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"]

export type GroupMemberInsert = Database["public"]["Tables"]["group_members"]["Insert"]