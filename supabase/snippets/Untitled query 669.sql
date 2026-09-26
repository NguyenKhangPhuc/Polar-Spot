ALTER VIEW public.user_group_final_scores 
SET (security_invoker = true);
GRANT SELECT ON user_group_final_scores TO authenticated;