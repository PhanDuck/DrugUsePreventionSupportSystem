-- Check and update consultation fees for consultants

USE DrugPreventionDB;
GO

-- Check current consultation fees
SELECT 
    u.id,
    u.username,
    u.first_name + ' ' + u.last_name as full_name,
    r.name as role,
    u.consultation_fee
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'
ORDER BY u.id;

-- Update consultation fees to VND values
UPDATE users 
SET consultation_fee = 100000.0 
WHERE role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT') 
AND (consultation_fee IS NULL OR consultation_fee < 1000);

-- Set specific fees for known consultants
UPDATE users 
SET consultation_fee = 150000.0 
WHERE username = 'consultant1' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

UPDATE users 
SET consultation_fee = 120000.0 
WHERE username = 'consultant2' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

UPDATE users 
SET consultation_fee = 180000.0 
WHERE username = 'consultant3' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

UPDATE users 
SET consultation_fee = 200000.0 
WHERE username = 'tuvan' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

-- Verify the updates
SELECT 
    u.id,
    u.username,
    u.first_name + ' ' + u.last_name as full_name,
    r.name as role,
    u.consultation_fee
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'
ORDER BY u.consultation_fee DESC; 