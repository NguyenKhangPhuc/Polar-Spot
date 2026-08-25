-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP POLICY "Enable delete for users based on user_id" ON public.event_grading_criteria;

DROP POLICY "Enable insert for authenticated users only" ON public.event_grading_criteria;

DROP POLICY "Enable read access for all users" ON public.event_grading_criteria;

DROP POLICY "Policy with table joins" ON public.event_grading_criteria;

DROP POLICY "Enable delete for users based on user_id" ON public.events;

DROP POLICY "Enable insert for authenticated users only" ON public.events;

DROP POLICY "Policy with table joins" ON public.events;

DROP POLICY "All-test" ON public.group_members;

DROP POLICY "Enable delete for users based on user_id" ON public.groups;

DROP POLICY "Enable insert for authenticated users only" ON public.groups;

DROP POLICY "Only admin or judge can view groups" ON public.groups;

DROP POLICY "Policy with table joins" ON public.groups;

DROP POLICY "Enable insert for authenticated users only" ON public.user_group_grading;

DROP POLICY "Enable read access for all users" ON public.user_group_grading;

CREATE POLICY "Enable delete for users based on user_id" ON public.event_grading_criteria
  FOR DELETE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable insert for authenticated users only" ON public.event_grading_criteria
  FOR INSERT
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Policy with table joins" ON public.event_grading_criteria
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable delete for users based on user_id" ON public.events
  FOR DELETE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable insert for authenticated users only" ON public.events
  FOR INSERT
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Policy with table joins" ON public.events
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE TABLE public.group_feedbacks (
  id           uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at   timestamp with time zone DEFAULT now() NOT NULL,
  group_id     uuid                     DEFAULT gen_random_uuid(),
  user_id      uuid                     DEFAULT gen_random_uuid(),
  display_name text,
  description  text
);

ALTER TABLE public.group_feedbacks
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.group_feedbacks
  ADD CONSTRAINT group_feedbacks_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.group_feedbacks
  ADD CONSTRAINT group_feedbacks_pkey PRIMARY KEY (id);

ALTER TABLE public.group_feedbacks
  ADD CONSTRAINT group_feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.group_feedbacks
  ADD CONSTRAINT unique_group_user_feedback UNIQUE (group_id, user_id);

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_feedbacks TO anon;

GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON public.group_feedbacks TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_feedbacks TO service_role;

CREATE POLICY "Enable delete for users based on user_id" ON public.group_feedbacks
  FOR DELETE
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for authenticated users only" ON public.group_feedbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_judge());

CREATE POLICY "Enable read access for all users" ON public.group_feedbacks
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.group_feedbacks
  FOR UPDATE
  TO authenticated
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable delete for users based on user_id" ON public.group_members
  FOR DELETE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable insert for authenticated users only" ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable read access for all users" ON public.group_members
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.group_members
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable delete for users based on user_id" ON public.groups
  FOR DELETE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Enable insert for authenticated users only" ON public.groups
  FOR INSERT
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

CREATE POLICY "Policy with table joins" ON public.groups
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));

ALTER TABLE public.profiles
  ADD COLUMN created_at timestamp without time zone DEFAULT now();

CREATE POLICY "Enable insert for authenticated users only" ON public.user_group_grading
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_judge());