-- Check consultant data in the database
USE DrugPreventionDB;
GO

PRINT '=== CHECKING CONSULTANT DATA ===';

-- Check all consultant users
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.first_name + ' ' + u.last_name as concatenated_name,
    u.email,
    u.degree,
    u.expertise,
    u.consultation_fee,
    r.name as role_name
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'
ORDER BY u.id;

PRINT '';
PRINT '=== CONSULTANT COUNT ===';
SELECT COUNT(*) as consultant_count
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT';

PRINT '';
PRINT '=== CHECKING FOR NULL/EMPTY NAMES ===';
SELECT 
    u.id,
    u.username,
    CASE 
        WHEN u.first_name IS NULL OR u.first_name = '' THEN 'NULL/EMPTY'
        ELSE 'HAS VALUE'
    END as first_name_status,
    CASE 
        WHEN u.last_name IS NULL OR u.last_name = '' THEN 'NULL/EMPTY'
        ELSE 'HAS VALUE'
    END as last_name_status,
    u.first_name,
    u.last_name
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'; 