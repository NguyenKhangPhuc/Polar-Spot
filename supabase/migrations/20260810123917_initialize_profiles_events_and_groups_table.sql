-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

CREATE TYPE public."EVENT_STATUS" AS ENUM (
  'ongoing',
  'finished'
);

CREATE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    null,
    lower(new.raw_user_meta_data->>'email')
  );
  return new;
end;
$function$;

CREATE TABLE public.events (
  id                uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at        timestamp with time zone DEFAULT now() NOT NULL,
  status            public."EVENT_STATUS",
  organized_date    timestamp with time zone,
  start_date        date,
  end_date          date,
  location          text,
  member_per_groups smallint,
  short_description text,
  content           text
);

ALTER TABLE public.events
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.events
  ADD CONSTRAINT events_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.events TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.events TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.events TO service_role;

CREATE POLICY "Enable delete for users based on user_id" ON public.events
  FOR DELETE
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.events
  FOR UPDATE
  USING (true);

CREATE TABLE public.groups (
  id                uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at        timestamp with time zone DEFAULT now() NOT NULL,
  group_name        text,
  short_description text,
  avatar_url        text,
  event_id          uuid                     DEFAULT gen_random_uuid()
);

ALTER TABLE public.groups
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.groups
  ADD CONSTRAINT groups_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.groups TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.groups TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.groups TO service_role;

CREATE POLICY "Enable delete for users based on user_id" ON public.groups
  FOR DELETE
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.groups
  FOR SELECT
  USING (true);

CREATE POLICY "Policy with table joins" ON public.groups
  FOR UPDATE
  USING (true);

CREATE TABLE public.profiles (
  id           uuid NOT NULL,
  full_name    text,
  email        text,
  avatar_url   text,
  company_name text,
  programme    text,
  university   text,
  degree       text,
  year         text,
  company_unit text,
  job_title    text,
  github       text,
  "linkedIn"   text,
  description  text
);

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO service_role;