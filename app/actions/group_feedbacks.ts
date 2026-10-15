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
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const payload: GroupFeedbackInsert = {
        ...feedback,
        user_id: user?.id,
    };

    const { data, error } = await supabase
        .from('group_feedbacks')
        .upsert(payload)
        .select();

    if (error) {
        console.error("Failed to upsert group feedback:", error);
        return { data: null, error: "Failed to submit group feedback" };
    }

    return { data: data as GroupFeedback[], error: null };
}

/**
 * PURPOSE:
 * Fetches the current user's feedback record assigned to a specific group.
 * Feedback is unique per user per group, so this returns a single record (or null if none exists).
 *
 * CONTEXT/PARENT FILE:
 * Called by grading page and give feedback modal to pre-populate default values.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 */
export async function getGroupFeedbacksByGroupId(groupId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
        .from('group_feedbacks')
        .select('*')
        .eq('group_id', groupId);

    if (user?.id) {
        query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
        console.error("Failed to fetch group feedback:", error);
        return { data: null, error: "Failed to fetch group feedback" };
    }

    return { data: data as GroupFeedback | null, error: null };
}

/**
 * PURPOSE:
 * Fetches all feedback records assigned to a specific group across all users.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/groups/[id]/feedbacks/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 */
export async function fetchAllFeedbacksByGroupId(groupId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_feedbacks')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch all group feedbacks:", error);
        return { data: null, error: "Failed to fetch all group feedbacks" };
    }

    return { data: data as GroupFeedback[], error: null };
}

