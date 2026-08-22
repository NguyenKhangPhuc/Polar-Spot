-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

ALTER TABLE public.group_members
  DROP CONSTRAINT group_members_member_id_fkey;

ALTER TABLE public.group_members
  DROP COLUMN member_id;

DROP TABLE public.invitations;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    null,
    lower(new.raw_user_meta_data->>'email')
  )
  on conflict (id) do nothing; -- tránh lỗi nếu row đã tồn tại

  return new;
end;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

REVOKE ALL ON public.event_grading_criteria FROM anon;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.event_grading_criteria FROM authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.event_grading_criteria TO authenticated;

ALTER TABLE public.events
  ADD COLUMN title text;

REVOKE DELETE, INSERT, MAINTAIN, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.events FROM anon;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.events FROM authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.events TO authenticated;

ALTER TABLE public.group_members
  ADD COLUMN member_name text;

ALTER TABLE public.group_members
  ADD COLUMN member_email text;

REVOKE ALL ON public.group_members FROM anon;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_members FROM authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.group_members TO authenticated;

CREATE POLICY "All-test" ON public.group_members
  USING (true)
  WITH CHECK (true);

REVOKE DELETE, INSERT, MAINTAIN, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.groups FROM anon;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.groups FROM authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.groups TO authenticated;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles FROM anon;

GRANT INSERT, SELECT ON public.profiles TO anon;

REVOKE MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles FROM authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.profiles TO authenticated;

CREATE POLICY "Enable delete for users based on user_id" ON public.profiles
  FOR DELETE
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.profiles
  FOR UPDATE
  USING (true);

CREATE TABLE public.user_group_grading (
  id          uuid                     DEFAULT gen_random_uuid() NOT NULL,
  user_id     uuid                     DEFAULT gen_random_uuid(),
  criteria_id uuid                     DEFAULT gen_random_uuid(),
  group_id    uuid                     DEFAULT gen_random_uuid(),
  grade       integer,
  created_at  timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.user_group_grading
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_group_grading
  ADD CONSTRAINT unique_user_group_criteria UNIQUE (user_id, group_id, criteria_id);

ALTER TABLE public.user_group_grading
  ADD CONSTRAINT user_group_grading_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES public.event_grading_criteria(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.user_group_grading
  ADD CONSTRAINT user_group_grading_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.user_group_grading
  ADD CONSTRAINT user_group_grading_pkey PRIMARY KEY (id);

ALTER TABLE public.user_group_grading
  ADD CONSTRAINT user_group_grading_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.user_group_grading TO anon;

GRANT ALL ON public.user_group_grading TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.user_group_grading TO service_role;

CREATE POLICY "Enable delete for users based on user_id" ON public.user_group_grading
  FOR DELETE
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for authenticated users only" ON public.user_group_grading
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.user_group_grading
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.user_group_grading
  FOR UPDATE
  USING ((( SELECT auth.uid() AS uid) = user_id));