create view user_group_final_scores as
select
  g.id as group_id,
  g.group_name,
  g.event_id,
  e.title as event_title,
  u.id as user_id,
  u.full_name,
  avg(ugg.grade) as user_group_final_score,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'criteria_id', ugg.criteria_id,
        'criteria_name', egc.name,
        'user_grade', ugg.grade
      ) order by ugg.criteria_id
    ),
    '[]'::jsonb
  ) as grading_details
from user_group_grading ugg
join groups g on g.id = ugg.group_id
join profiles u on u.id = ugg.user_id
join event_grading_criteria egc on egc.id = ugg.criteria_id
left join events e on e.id = g.event_id
group by g.id, g.group_name, g.event_id, e.title, u.id, u.full_name;