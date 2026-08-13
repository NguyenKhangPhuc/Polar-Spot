'use server';

import { Criteria, CriteriaInsert } from "../types/event_criteria";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches all grading criteria records associated with a specific event ID.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/events/[id]/edit/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of target event.
 */
export async function getEventCriteriaByEventId(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('event_grading_criteria')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

    if (error) {
        return { data: null, error: "Fail to fetch event criteria" };
    }
    return { data: data as Criteria[], error: null };
}

/**
 * PURPOSE:
 * Inserts a new grading criteria record into event_grading_criteria table.
 *
 * CONTEXT/PARENT FILE:
 * Called by CriteriaSection in app/events/[id]/edit/components/CriteriaSection.tsx.
 *
 * INPUTS / PARAMETERS:
 * - criteria (CriteriaInsert, Required): Criteria payload object.
 */
export async function createCriteria(criteria: CriteriaInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('event_grading_criteria')
        .insert(criteria)
        .select()
        .single();

    if (error) {
        console.log(error)
        return { data: null, error: "Fail to create criteria" };
    }
    return { data: data as Criteria, error: null };
}



/**
 * PURPOSE:
 * Updates an existing grading criteria record in event_grading_criteria table.
 *
 * CONTEXT/PARENT FILE:
 * Called by CriteriaSection in app/events/[id]/edit/components/CriteriaSection.tsx.
 *
 * INPUTS / PARAMETERS:
 * - criteria (CriteriaInsert, Required): Criteria payload object containing valid id.
 */
export async function updateCriteria(criteria: CriteriaInsert) {
    if (!criteria.id) {
        return { data: null, error: "Missing criteria ID for update" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('event_grading_criteria')
        .update(criteria)
        .eq('id', criteria.id)
        .select()
        .single();

    if (error) {
        return { data: null, error: "Fail to update criteria" };
    }
    return { data: data as Criteria, error: null };
}

// Alias for compatibility
export async function updateEventCriteria({
    updatedCriteria,
}: {
    updatedCriteria: CriteriaInsert;
}) {
    return updateCriteria(updatedCriteria);
}