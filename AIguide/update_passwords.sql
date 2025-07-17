-- =============================================
-- UPDATE PASSWORDS WITH NEW BCrypt HASH
-- =============================================

USE DrugPreventionDB;
GO

PRINT '=== UPDATING PASSWORDS WITH NEW BCrypt HASH ===';

-- New BCrypt hash for "123123" (generated with BCrypt encoder)
-- This hash is compatible with Spring Security BCryptPasswordEncoder
DECLARE @newPasswordHash NVARCHAR(255) = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa';

-- Update all user passwords
UPDATE users 
SET password = @newPasswordHash
WHERE username IN (
    'admin',
    'user1', 'user2', 'user3', 'user4',
    'consultant1', 'consultant2', 'consultant3',
    'manager1', 'staff1', 'staff2'
);

-- Verify the update
SELECT 
    username,
    CASE 
        WHEN password = @newPasswordHash THEN '✅ Updated'
        ELSE '❌ Not Updated'
    END as status,
    LEN(password) as hash_length
FROM users 
WHERE username IN (
    'admin',
    'user1', 'user2', 'user3', 'user4',
    'consultant1', 'consultant2', 'consultant3',
    'manager1', 'staff1', 'staff2'
);

PRINT '=== PASSWORD UPDATE COMPLETED ===';
PRINT 'All users now have password: 123123';
PRINT 'You can login with any username and password: 123123'; 