-- 1. Thu hồi toàn bộ quyền dữ liệu hiện tại của anon trên các bảng
REVOKE ALL ON public.event_grading_criteria, public.events, public.group_members, public.groups, public.invitations, public.profiles FROM anon;
REVOKE ALL ON public.event_grading_criteria, public.events, public.group_members, public.groups, public.invitations, public.profiles FROM authenticated;

-- 2. Cấp quyền chuẩn cho role authenticated (Người dùng đã đăng nhập được phép thao tác)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_grading_criteria, public.events, public.group_members, public.groups, public.invitations, public.profiles TO authenticated;

-- 3. Chỉ cấp quyền SELECT (hoặc tùy chọn) cho role anon nếu bảng đó thực sự cho phép khách vãng lai xem
-- Ví dụ: Bảng events cho phép khách xem, còn lại KHÔNG cho anon chạm vào
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.groups TO anon;