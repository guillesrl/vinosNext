-- Ejecuta esto en el SQL Editor de Supabase
SELECT
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'vinos'
    AND table_schema = 'public'
ORDER BY ordinal_position;
