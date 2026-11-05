import { Database } from "./database.types";

export type GroupFeedback = Database["public"]["Tables"]["group_feedbacks"]["Row"];
export type GroupFeedbackInsert = Database["public"]["Tables"]["group_feedbacks"]["Insert"];
export type GroupFeedbackUpdate = Database["public"]["Tables"]["group_feedbacks"]["Update"];

export interface GroupFeedbackWithGroupAndEvent extends GroupFeedback {
  groups: {
    id: string;
    group_name: string | null;
    avatar_url: string | null;
    event_id: string | null;
    events: {
      id: string;
      title: string | null;
    } | null;
  } | null;
}
