import { Database } from "./database.types";

export type Criteria = Database["public"]["Tables"]["event_grading_criteria"]["Row"];
export type CriteriaInsert = Database["public"]["Tables"]["event_grading_criteria"]["Insert"];
export type CriteriaUpdate = Database["public"]["Tables"]["event_grading_criteria"]["Update"];
