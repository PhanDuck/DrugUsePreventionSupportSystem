-- ============================================
-- CHECK TABLE STRUCTURE BEFORE FIXING ENCODING
-- ============================================

USE DrugPreventionDB;
GO

-- Check all tables and their columns
SELECT 
    t.name AS table_name,
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.collation_name,
    c.is_nullable
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
ORDER BY t.name, c.column_id;

-- Check specific tables that might have issues
PRINT '=== CHECKING BLOGS TABLE ===';
SELECT 
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.collation_name
FROM sys.columns c
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
INNER JOIN sys.tables t ON c.object_id = t.object_id
WHERE t.name = 'blogs'
ORDER BY c.column_id;

PRINT '=== CHECKING RECOMMENDATIONS TABLE ===';
SELECT 
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.collation_name
FROM sys.columns c
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
INNER JOIN sys.tables t ON c.object_id = t.object_id
WHERE t.name = 'recommendations'
ORDER BY c.column_id;

PRINT '=== CHECKING REVIEWS TABLE ===';
SELECT 
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.collation_name
FROM sys.columns c
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
INNER JOIN sys.tables t ON c.object_id = t.object_id
WHERE t.name = 'reviews'
ORDER BY c.column_id; 