-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP POLICY "Enable read access for all users" ON public.group_feedbacks;

CREATE POLICY "Enable read access for all users" ON public.group_feedbacks
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_judge());

ALTER POLICY "Enable read access for all users" ON public.group_members TO authenticated;

ALTER POLICY "Enable read access for all users" ON public.groups TO authenticated;