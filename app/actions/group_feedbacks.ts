'use server';

import { GroupFeedback, GroupFeedbackInsert } from "../types/group_feedbacks";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Server Action module handling group feedback queries and database upserts.
 * Allows users to submit or update feedback for a registered group.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/events/[id]/groups/components/GiveFeedbackModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - feedback (GroupFeedbackInsert, Required): Payload containing group_id, display_name, and description.
 */
export async function upsertGroupFeedback(feedback: GroupFeedbackInsert) {
    /**
     * BEHAVIORAL MECHANISM:
     * Resolves active Supabase user session and executes upsert on 'group_feedbacks' table.
     * Returns newly created or updated feedback record.
     *
     * PARAMETERS:
     * - feedback (GroupFeedbackInsert): Feedback row payload.
     *
     * RETURNS:
     * - Object: { data: GroupFeedback[] | null, error: string | null }
     */
    const supabase = await createClient();


    const { data, error } = await supabase
        .from('group_feedbacks')
        .upsert(feedback, { onConflict: 'group_id, user_id' })
        .select();

    if (error) {
        console.error("Failed to upsert group feedback:", error);
        return { data: null, error: "Failed to submit group feedback" };
    }

    return { data: data as GroupFeedback[], error: null };
}

/**
 * PURPOSE:
 * Fetches all feedback records assigned to a specific group.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/groups/[id]/feedbacks page components.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 */
export async function getGroupFeedbacksByGroupId(groupId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_feedbacks')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch group feedbacks:", error);
        return { data: null, error: "Failed to fetch group feedbacks" };
    }

    return { data: data as GroupFeedback[], error: null };
}
