ALTER TABLE user_group_grading ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_grading_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin or judge can view user_group_grading"
ON user_group_grading FOR SELECT
TO authenticated
USING (is_admin_or_judge());

CREATE POLICY "Only admin or judge can view event_grading_criteria"
ON event_grading_criteria FOR SELECT
TO authenticated
USING (is_admin_or_judge());

CREATE POLICY "Only admin or judge can view groups"
ON groups FOR SELECT
TO authenticated
USING (is_admin_or_judge());