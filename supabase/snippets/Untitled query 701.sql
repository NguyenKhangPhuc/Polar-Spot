CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Chạy với quyền của creator nếu cần bypass RLS đọc bảng profiles
STABLE
AS $$
DECLARE
    v_is_authorized BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('admin')
    ) INTO v_is_authorized;

    RETURN v_is_authorized;
END;
$$;

-- Cách gọi hàm:
SELECT is_admin();