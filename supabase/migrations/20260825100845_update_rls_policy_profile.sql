-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP POLICY "Enable delete for users based on user_id" ON public.profiles;

DROP POLICY "Policy with table joins" ON public.profiles;

CREATE POLICY "Enable delete for users based on user_id" ON public.profiles
  FOR DELETE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE ((profiles_1.id = ( SELECT auth.uid() AS uid)) AND (profiles_1.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Policy with table joins" ON public.profiles
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE ((profiles_1.id = ( SELECT auth.uid() AS uid)) AND (profiles_1.role = 'admin'::public."PROFILE_ROLE")))));