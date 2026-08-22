'use server';

import { GroupFinalScore } from "../types/final_score";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches group final evaluation scores from the 'group_final_scores' database view for a specific event.
 *
 * CONTEXT/PARENT FILE:
 * Called concurrently by app/events/[id]/result/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of target event.
 */
export async function getGroupFinalScoresByEventId(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_final_scores')
        .select('*')
        .eq('event_id', eventId);

    if (error) {
        console.error("Error fetching group_final_scores:", error);
        return { data: null, error: "Fail to fetch group final scores" };
    }

    const formattedData: GroupFinalScore[] = (data || []).map((row: any) => ({
        group_id: row.group_id || "",
        group_name: row.group_name || null,
        event_id: row.event_id || null,
        final_avg_score: typeof row.final_avg_score === "number" ? row.final_avg_score : null,
        criteria: Array.isArray(row.criteria) ? row.criteria : [],
    }));

    return { data: formattedData, error: null };
}
