-- Migration unit: update_group_final_scores_view
-- Transaction mode: transactional

SET check_function_bodies = false;

CREATE OR REPLACE VIEW public.group_final_cell WITH (security_invoker=true) AS
SELECT
    group_id,
    avg(user_total) AS final_avg_score,
    count(user_id)::integer AS total_graders
FROM public.group_user_final_points
GROUP BY group_id;

DROP VIEW IF EXISTS public.group_final_scores;

CREATE VIEW public.group_final_scores WITH (security_invoker=true) AS
SELECT
    g.id AS group_id,
    g.group_name,
    g.event_id,
    fc.final_avg_score,
    COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'criteria_id', gc.criteria_id,
                'criteria_name', gc.criteria_name,
                'avg_score', gc.avg_score,
                'graders', gc.graders
            ) ORDER BY gc.criteria_id
        )
        FROM public.group_criteria_cells gc
        WHERE gc.group_id = g.id
    ), '[]'::jsonb) AS criteria,
    COALESCE(fc.total_graders, 0)::integer AS total_graders,
    (
        SELECT gufp.user_total
        FROM public.group_user_final_points gufp
        WHERE gufp.group_id = g.id
          AND gufp.user_id = (SELECT auth.uid() AS uid)
    ) AS user_final_score
FROM public.groups g
LEFT JOIN public.group_final_cell fc ON fc.group_id = g.id;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_cell TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_cell TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_cell TO service_role;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_scores TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.group_final_scores TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.group_final_scores TO service_role;
