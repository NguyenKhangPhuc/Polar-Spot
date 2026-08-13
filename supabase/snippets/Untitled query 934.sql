-- Xoá trigger cũ (nếu có) và function cũ
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Tạo function mới
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    null,
    lower(new.raw_user_meta_data->>'email')
  )
  on conflict (id) do nothing; -- tránh lỗi nếu row đã tồn tại

  return new;
end;
$$;

-- Gắn trigger vào auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();