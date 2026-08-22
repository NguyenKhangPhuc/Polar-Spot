CREATE OR REPLACE FUNCTION is_admin_or_judge()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  select exists (
    select 1 from profiles p
    where p.id = (select auth.uid()) 
    and p.role in ('admin', 'judge')
  );
$$;