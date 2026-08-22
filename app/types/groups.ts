import { Database } from "./database.types";

export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"];
export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];
export type GroupMemberWithProfile = GroupMember;

export interface GroupWithMembersAndEvent extends Group {
  events: {
    id: string;
    short_description: string | null;
    location: string | null;
  } | null;
  group_members: GroupMember[];
}