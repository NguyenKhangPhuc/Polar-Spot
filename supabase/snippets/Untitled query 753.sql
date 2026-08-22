CREATE view group_user_final_points as
select
  group_id,
  user_id,
  user_name,
  avg(grade) as user_total
from group_criteria_user_grades
group by group_id, user_id, user_name;

CREATE view group_final_cell as
select
  group_id,
  avg(user_total) as final_avg_score
from group_user_final_points
group by group_id;

CREATE view group_final_scores as
select
  g.id as group_id,
  g.group_name,
  g.event_id,
  fc.final_avg_score,
  coalesce(
    (select jsonb_agg(jsonb_build_object(
       'criteria_id', criteria_id,
       'criteria_name', criteria_name,
       'avg_score', avg_score,
       'graders', graders
     ) order by criteria_id)
     from group_criteria_cells gc
     where gc.group_id = g.id),
    '[]'::jsonb
  ) as criteria
from groups g
left join group_final_cell fc on fc.group_id = g.id;