'use server';

import { GroupFinalScore, CriteriaCell, CriteriaGrader } from "../types/final_score";
import { createClient } from "../utils/supabase/server";

interface GroupFinalScoresViewRow {
    group_id: string | null;
    group_name: string | null;
    event_id: string | null;
    final_avg_score: number | null;
    total_graders?: number | null;
    user_final_score?: number | null;
    criteria: CriteriaCell[] | null;
}

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

    const rawRows = (data || []) as unknown as GroupFinalScoresViewRow[];

    const formattedData: GroupFinalScore[] = rawRows.map((row) => {
        const criteria = Array.isArray(row.criteria) ? row.criteria : [];

        // Fallback computation for total_graders if view does not yet return it
        let totalGraders: number = typeof row.total_graders === "number" ? row.total_graders : 0;
        if (typeof row.total_graders !== "number") {
            const uniqueGraders = new Set<string>();
            criteria.forEach((crit: CriteriaCell) => {
                if (Array.isArray(crit.graders)) {
                    crit.graders.forEach((g: CriteriaGrader) => {
                        if (g?.user_id) uniqueGraders.add(g.user_id);
                    });
                }
            });
            totalGraders = uniqueGraders.size;
        }

        return {
            group_id: row.group_id || "",
            group_name: row.group_name || null,
            event_id: row.event_id || null,
            final_avg_score: typeof row.final_avg_score === "number" ? row.final_avg_score : null,
            total_graders: totalGraders,
            user_final_score: typeof row.user_final_score === "number" ? row.user_final_score : null,
            criteria,
        };
    });

    return { data: formattedData, error: null };
}
