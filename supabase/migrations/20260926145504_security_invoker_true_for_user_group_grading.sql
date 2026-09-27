-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

ALTER VIEW public.user_group_final_scores SET (security_invoker=true);