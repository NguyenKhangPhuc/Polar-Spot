-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

ALTER TABLE public.events
  ADD COLUMN max_score integer;

ALTER TABLE public.groups
  ADD COLUMN youtube_link text;

CREATE VIEW public.user_group_final_scores AS SELECT g.id AS group_id,
    g.group_name,
    g.event_id,
    e.title AS event_title,
    u.id AS user_id,
    u.full_name,
    avg(ugg.grade) AS user_group_final_score,
    COALESCE(jsonb_agg(jsonb_build_object('criteria_id', ugg.criteria_id, 'criteria_name', egc.name, 'user_grade', ugg.grade) ORDER BY ugg.criteria_id), '[]'::jsonb) AS grading_details
   FROM ((((public.user_group_grading ugg
     JOIN public.groups g ON ((g.id = ugg.group_id)))
     JOIN public.profiles u ON ((u.id = ugg.user_id)))
     JOIN public.event_grading_criteria egc ON ((egc.id = ugg.criteria_id)))
     LEFT JOIN public.events e ON ((e.id = g.event_id)))
  GROUP BY g.id, g.group_name, g.event_id, e.title, u.id, u.full_name;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.user_group_final_scores TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.user_group_final_scores TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.user_group_final_scores TO service_role;