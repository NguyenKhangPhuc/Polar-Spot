import { Database } from "./database.types";

export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"];
export type GroupUpdate = Database["public"]["Tables"]["groups"]["Update"];
export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];
export type GroupMemberInsert = Database["public"]["Tables"]["group_members"]["Insert"];
export type GroupMemberUpdate = Database["public"]["Tables"]["group_members"]["Update"];
export type GroupMemberWithProfile = GroupMember;

export interface GroupWithMembersAndEvent extends Group {
  events: {
    id: string;
    title?: string | null;
    short_description: string | null;
    location: string | null;
  } | null;
  group_members: GroupMember[];
}
