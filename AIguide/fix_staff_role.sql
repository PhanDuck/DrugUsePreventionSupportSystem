-- Fix staff role consistency
-- Update user "stab" to have correct STAFF role (role_id = 5)
-- Based on current database: ADMIN=1, USER=2, CONSULTANT=3, MANAGER=4, STAFF=5, GUEST=6

USE DrugPreventionDB;
GO

-- Check current roles table
SELECT * FROM roles ORDER BY id;

-- Check current user "stab"
SELECT username, role_id FROM users WHERE username = 'stab';

-- Update user "stab" to have STAFF role (role_id = 5)
UPDATE users 
SET role_id = 5 
WHERE username = 'stab';

-- Verify the update
SELECT u.username, u.role_id, r.name as role_name
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE u.username = 'stab';

PRINT 'User "stab" role updated successfully to STAFF (role_id = 5)'; 