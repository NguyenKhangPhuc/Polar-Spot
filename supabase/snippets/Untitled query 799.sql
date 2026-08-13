SELECT 
    table_name, 
    grantee, 
    privilege_type 
FROM 
    information_schema.table_privileges 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, 
    grantee;