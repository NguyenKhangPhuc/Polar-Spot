ALTER TABLE public.group_feedbacks
ADD CONSTRAINT unique_group_user_feedback UNIQUE (group_id, user_id);