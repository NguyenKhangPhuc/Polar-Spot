'use server';

import {
    GroupFeedback,
    GroupFeedbackInsert,
    GroupFeedbackWithGroupAndEvent,
} from "../types/group_feedbacks";
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

    let resolvedUserId = feedback.user_id;
    if (!resolvedUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        resolvedUserId = user?.id;
    }

    const payload: GroupFeedbackInsert = {
        ...feedback,
        user_id: resolvedUserId,
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
 * - userId (string, Optional): Authenticated user UUID to avoid redundant auth.getUser() lookup.
 */
export async function getGroupFeedbacksByGroupId(groupId: string, userId?: string) {
    const supabase = await createClient();

    let resolvedUserId = userId;
    if (!resolvedUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        resolvedUserId = user?.id;
    }

    let query = supabase
        .from('group_feedbacks')
        .select('*')
        .eq('group_id', groupId);

    if (resolvedUserId) {
        query = query.eq('user_id', resolvedUserId);
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

/**
 * PURPOSE:
 * Fetches feedback records submitted by the logged in evaluator/user, joining associated groups and events.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/feedbacks-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - userId (string, Optional): User ID of the logged in evaluator/user.
 */
export async function getEvaluatorFeedbacks(userId?: string) {
    const supabase = await createClient();

    let query = supabase
        .from('group_feedbacks')
        .select(`
            id,
            created_at,
            description,
            display_name,
            group_id,
            user_id,
            groups:group_id (
                id,
                group_name,
                avatar_url,
                event_id,
                events:event_id (
                    id,
                    title
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Failed to fetch evaluator feedbacks:", error);
        return { data: null, error: "Failed to fetch evaluator feedbacks" };
    }

    return { data: data as unknown as GroupFeedbackWithGroupAndEvent[], error: null };
}

/**
 * PURPOSE:
 * Updates description and display name of an existing group feedback record.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/feedbacks-management/components/EditFeedbackModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - id (string, Required): Unique identifier of target group feedback.
 * - description (string, Required): Updated feedback description text.
 * - displayName (string, Optional): Updated sender display name.
 */
export async function updateGroupFeedback(
    id: string,
    description: string,
    displayName?: string
) {
    const supabase = await createClient();

    const updatePayload: { description: string; display_name?: string } = {
        description: description.trim(),
    };
    if (displayName !== undefined) {
        updatePayload.display_name = displayName.trim();
    }

    const { data, error } = await supabase
        .from('group_feedbacks')
        .update(updatePayload)
        .eq('id', id)
        .select(`
            id,
            created_at,
            description,
            display_name,
            group_id,
            user_id,
            groups:group_id (
                id,
                group_name,
                avatar_url,
                event_id,
                events:event_id (
                    id,
                    title
                )
            )
        `)
        .single();

    if (error || !data) {
        console.error("Failed to update group feedback:", error);
        return { data: null, error: "Failed to update group feedback" };
    }

    return { data: data as unknown as GroupFeedbackWithGroupAndEvent, error: null };
}


