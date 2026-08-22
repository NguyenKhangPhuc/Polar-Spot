export interface CriteriaGrader {
    user_id: string;
    user_name: string | null;
    grade: number;
}

export interface CriteriaCell {
    criteria_id: string;
    criteria_name: string | null;
    avg_score: number | null;
    graders: CriteriaGrader[];
}

export interface GroupFinalScore {
    group_id: string;
    group_name: string | null;
    event_id: string | null;
    final_avg_score: number | null;
    criteria: CriteriaCell[];
}

export type GroupFinalScoresResponse = GroupFinalScore[];