-- Single comprehensive query to check consultant data
USE DrugPreventionDB;
GO

SELECT 
    '=== CONSULTANT DATA SUMMARY ===' as info;
GO

SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.first_name + ' ' + u.last_name as concatenated_name,
    CASE 
        WHEN u.first_name IS NULL OR u.first_name = '' THEN 'NULL/EMPTY'
        ELSE 'HAS VALUE'
    END as first_name_status,
    CASE 
        WHEN u.last_name IS NULL OR u.last_name = '' THEN 'NULL/EMPTY'
        ELSE 'HAS VALUE'
    END as last_name_status,
    u.email,
    u.degree,
    u.expertise,
    u.consultation_fee,
    r.name as role_name
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'
ORDER BY u.id;
GO

SELECT 
    '=== CONSULTANT COUNT ===' as info;
GO

SELECT COUNT(*) as consultant_count
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT';
GO 