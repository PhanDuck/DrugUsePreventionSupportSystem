-- Add consultation_fee column to users table
-- This allows consultants to set their own consultation fees (in VND)

USE DrugPreventionDB;
GO

-- Add consultation_fee column to users table
ALTER TABLE users 
ADD consultation_fee DECIMAL(10,2) DEFAULT 100000.0;

-- Update existing consultants with default fees (VND)
UPDATE users 
SET consultation_fee = 100000.0 
WHERE role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

-- Add some sample consultation fees for existing consultants (VND)
UPDATE users 
SET consultation_fee = 150000.0 
WHERE username = 'staff1' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

UPDATE users 
SET consultation_fee = 200000.0 
WHERE username = 'stab' AND role_id = (SELECT id FROM roles WHERE name = 'CONSULTANT');

-- Verify the changes
SELECT 
    u.username,
    u.first_name + ' ' + u.last_name as full_name,
    r.name as role,
    u.consultation_fee
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'CONSULTANT'
ORDER BY u.consultation_fee DESC; 