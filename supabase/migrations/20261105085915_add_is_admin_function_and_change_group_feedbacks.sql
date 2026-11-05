-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP POLICY "Enable read access for all users" ON public.group_feedbacks;

CREATE OR REPLACE FUNCTION public.is_admin_or_judge()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  AS $function$select exists (
    select 1 from profiles p
    where p.id = (select auth.uid()) 
    and p.role in ('admin', 'judge')
  );$function$;

CREATE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $function$
DECLARE
    v_is_authorized BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('admin')
    ) INTO v_is_authorized;

    RETURN v_is_authorized;
END;
$function$;

CREATE POLICY "Enable read access for all users" ON public.group_feedbacks
  FOR SELECT
  TO authenticated
  USING ((public.is_admin() OR (( SELECT auth.uid() AS uid) = user_id)));