'use server';

/**
 * PURPOSE:
 * Server Action module handling user group grading queries and database upserts.
 * Manages fetching previous evaluation scores for a user-group pair and saving new evaluations.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/groups/[id]/grading/page.tsx and GroupGradingClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string): Target group UUID.
 * - userId (string): Authenticated user UUID.
 * - gradings (UserGroupGradingInsert[]): Array of evaluation grade rows to upsert.
 */

import { UserGroupGrading, UserGroupGradingInsert } from "../types/user_group_grading";
import { UserGroupFinalScores } from "../types/all_users_group";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches all existing grading records for a specific group and user pair.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/groups/[id]/grading/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 * - userId (string, Required): Unique identifier of evaluating user.
 */
export async function getUserGroupGradingByGroupAndUserId(groupId: string, userId: string) {
    /**
     * BEHAVIORAL MECHANISM:
     * Queries Supabase 'user_group_grading' table filtering by group_id and user_id.
     * Returns list of previously assigned scores for initial form state population.
     *
     * PARAMETERS:
     * - groupId (string): Target group UUID.
     * - userId (string): Evaluator user UUID.
     *
     * RETURNS:
     * - Object: { data: UserGroupGrading[] | null, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('user_group_grading')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', userId);

    if (error) {
        console.log(error);
        return { data: null, error: "Fail to fetch user group gradings" };
    }
    return { data: data as UserGroupGrading[], error: null };
}

/**
 * PURPOSE:
 * Upserts user group grading evaluation scores into user_group_grading table.
 *
 * CONTEXT/PARENT FILE:
 * Called by GroupGradingClient component in app/groups/[id]/grading/GroupGradingClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - gradings (UserGroupGradingInsert[], Required): Array of evaluation records to upsert.
 */
export async function upsertUserGroupGrading(gradings: UserGroupGradingInsert[]) {
    /**
     * BEHAVIORAL MECHANISM:
     * Executes bulk upsert on Supabase 'user_group_grading' table using unique constraint
     * on (user_id, group_id, criteria_id). If a score already exists for the given user, group,
     * and criteria, it updates the grade value; otherwise, it inserts a new row.
     *
     * PARAMETERS:
     * - gradings (UserGroupGradingInsert[]): List of grade row payloads.
     *
     * RETURNS:
     * - Object: { data: UserGroupGrading[] | null, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('user_group_grading')
        .upsert(gradings as any, {
            onConflict: 'user_id,group_id,criteria_id',
        })
        .select();

    if (error) {
        console.log(error);
        return { data: null, error: "Fail to submit group grading" };
    }
    return { data: data as UserGroupGrading[], error: null };
}

/**
 * PURPOSE:
 * Fetches all user group grading results and details from 'user_group_final_scores' view for an event.
 *
 * CONTEXT/PARENT FILE:
 * Called concurrently by app/events/[id]/result/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Target event UUID.
 */
export async function getAllUsersGroupGradings(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('user_group_final_scores')
        .select('*')
        .eq('event_id', eventId);

    if (error) {
        console.error("Error fetching user_group_final_scores:", error);
        return { data: null, error: "Fail to fetch all users group gradings" };
    }

    return { data: (data as UserGroupFinalScores) || [], error: null };
}

