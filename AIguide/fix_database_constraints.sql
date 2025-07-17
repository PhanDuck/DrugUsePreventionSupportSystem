-- Fix database constraints that prevent Hibernate from altering columns
USE DrugPreventionDB;
GO

-- Drop constraints that prevent column alterations
IF EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF__courses__average__40058253')
    ALTER TABLE courses DROP CONSTRAINT DF__courses__average__40058253;

IF EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF__courses__difficu__3B40CD36')
    ALTER TABLE courses DROP CONSTRAINT DF__courses__difficu__3B40CD36;

IF EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF__courses__languag__3C34F16F')
    ALTER TABLE courses DROP CONSTRAINT DF__courses__languag__3C34F16F;

IF EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF__courses__price__3A4CA8FD')
    ALTER TABLE courses DROP CONSTRAINT DF__courses__price__3A4CA8FD;

-- Check if there are any other constraints to drop
SELECT 
    dc.name AS constraint_name,
    c.name AS column_name,
    t.name AS table_name
FROM sys.default_constraints dc
INNER JOIN sys.columns c ON dc.parent_column_id = c.column_id
INNER JOIN sys.tables t ON dc.parent_object_id = t.object_id
WHERE t.name = 'courses'
    AND c.name IN ('average_rating', 'difficulty_level', 'language', 'price');

PRINT 'Constraints dropped successfully. Hibernate can now alter columns.';

-- Also fix the DDL mode for better compatibility
-- Set application properties to use 'validate' instead of 'update'
PRINT 'Recommendation: Change spring.jpa.hibernate.ddl-auto to "validate" after running this script'; 