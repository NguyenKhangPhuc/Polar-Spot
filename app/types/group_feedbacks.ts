import { Database } from "./database.types"

export type GroupFeedback = Database["public"]["Tables"]["group_feedbacks"]["Row"]

export type GroupFeedbackInsert = Database["public"]["Tables"]["group_feedbacks"]["Insert"]