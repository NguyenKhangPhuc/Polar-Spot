export type GradingDetail = {
    criteria_id: string;
    criteria_name: string;
    user_grade: number;
};

export type UserGroupFinalScore = {
    group_id: string;
    group_name: string;
    event_id: string;
    event_title: string;
    user_id: string;
    full_name: string;
    user_group_final_score: number;
    grading_details: GradingDetail[];
};

export type UserGroupFinalScores = UserGroupFinalScore[];