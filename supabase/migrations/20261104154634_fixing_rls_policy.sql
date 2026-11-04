-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

ALTER TABLE public.profiles
  DROP COLUMN "linkedIn";

ALTER TABLE public.profiles
  DROP COLUMN company_name;

ALTER TABLE public.profiles
  DROP COLUMN company_unit;

ALTER TABLE public.profiles
  DROP COLUMN degree;

ALTER TABLE public.profiles
  DROP COLUMN description;

ALTER TABLE public.profiles
  DROP COLUMN github;

ALTER TABLE public.profiles
  DROP COLUMN job_title;

ALTER TABLE public.profiles
  DROP COLUMN programme;

ALTER TABLE public.profiles
  DROP COLUMN university;

ALTER TABLE public.profiles
  DROP COLUMN year;

DROP POLICY "Enable read access for all users" ON public.group_members;

DROP POLICY "Enable read access for all users" ON public.groups;

CREATE POLICY "Enable read access for all users" ON public.group_members
  FOR SELECT
  USING (public.is_admin_or_judge());

CREATE POLICY "Enable read access for all users" ON public.groups
  FOR SELECT
  USING (public.is_admin_or_judge());