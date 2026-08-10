import { CriteriaInsert } from "../types/event_criteria";
import { createClient } from "../utils/supabase/server";

export async function createCriteria(criteria: CriteriaInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_grading_criteria').insert(criteria)
    if (error) {
        return { error: "Failed to create the criteria" }
    }
    return { data, error }
}

export async function updateCriteria(criteria: CriteriaInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_grading_criteria').update(criteria).eq('id', criteria.id!)
    if (error) {
        return { error: "Failed to update the criteria" }
    }
    return { data, error }
}