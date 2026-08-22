GRANT SELECT ON group_final_scores TO authenticated;

-- Cũng cần cấp cho các view trung gian nếu bạn query trực tiếp chúng
GRANT SELECT ON group_criteria_user_grades TO authenticated;
GRANT SELECT ON group_criteria_cells TO authenticated;
GRANT SELECT ON group_user_final_points TO authenticated;
GRANT SELECT ON group_final_cell TO authenticated;