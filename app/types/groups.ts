import { Database } from "./database.types";

export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"];

export interface GroupMemberWithProfile {
  id: string;
  group_id: string;
  member_id: string;
  created_at: string;
  profiles: {
    id: string;
    email: string | null;
    full_name?: string | null;
  } | null;
}

export interface GroupWithMembersAndEvent extends Group {
  events: {
    id: string;
    short_description: string | null;
    location: string | null;
  } | null;
  group_members: GroupMemberWithProfile[];
}