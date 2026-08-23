-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

CREATE TYPE public."PROFILE_ROLE" AS ENUM (
  'admin',
  'judge',
  'student'
);

CREATE FUNCTION public.is_admin_or_judge()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  AS $function$
  select exists (
    select 1 from profiles p
    where p.id = (select auth.uid()) 
    and p.role in ('admin', 'judge')
  );
$function$;

CREATE POLICY "Only admin or judge can view event_grading_criteria" ON public.event_grading_criteria
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_judge());

CREATE POLICY "Only admin or judge can view groups" ON public.groups
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_judge());

ALTER TABLE public.profiles
  ADD COLUMN role public."PROFILE_ROLE" DEFAULT 'student'::public."PROFILE_ROLE";

CREATE POLICY "Only admin or judge can view user_group_grading" ON public.user_group_grading
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_judge());

CREATE VIEW public.group_criteria_user_grades WITH (security_invoker=true) AS SELECT ugg.group_id,
    c.id AS criteria_id,
    c.name AS criteria_name,
    ugg.user_id,
    p.full_name AS user_name,
    ugg.grade
   FROM ((public.user_group_grading ugg
     JOIN public.event_grading_criteria c ON ((ugg.criteria_id = c.id)))
     JOIN public.profiles p ON ((p.id = ugg.user_id)));

CREATE VIEW public.group_criteria_cells WITH (security_invoker=true) AS SELECT group_id,
    criteria_id,
    criteria_name,
    avg(grade) AS avg_score,
    jsonb_agg(jsonb_build_object('user_id', user_id, 'user_name', user_name, 'grade', grade) ORDER BY user_id) AS graders
   FROM public.group_criteria_user_grades
  GROUP BY group_id, criteria_id, criteria_name;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_criteria_cells TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_criteria_cells TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_criteria_cells TO service_role;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_criteria_user_grades TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_criteria_user_grades TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_criteria_user_grades TO service_role;

CREATE VIEW public.group_user_final_points WITH (security_invoker=true) AS SELECT group_id,
    user_id,
    user_name,
    avg(grade) AS user_total
   FROM public.group_criteria_user_grades
  GROUP BY group_id, user_id, user_name;

CREATE VIEW public.group_final_cell WITH (security_invoker=true) AS SELECT group_id,
    avg(user_total) AS final_avg_score
   FROM public.group_user_final_points
  GROUP BY group_id;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_cell TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_cell TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_cell TO service_role;

CREATE VIEW public.group_final_scores WITH (security_invoker=true) AS SELECT g.id AS group_id,
    g.group_name,
    g.event_id,
    fc.final_avg_score,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('criteria_id', gc.criteria_id, 'criteria_name', gc.criteria_name, 'avg_score', gc.avg_score, 'graders', gc.graders) ORDER BY gc.criteria_id) AS jsonb_agg
           FROM public.group_criteria_cells gc
          WHERE (gc.group_id = g.id)), '[]'::jsonb) AS criteria
   FROM (public.groups g
     LEFT JOIN public.group_final_cell fc ON ((fc.group_id = g.id)));

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_scores TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_scores TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_scores TO service_role;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_user_final_points TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_user_final_points TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_user_final_points TO service_role;