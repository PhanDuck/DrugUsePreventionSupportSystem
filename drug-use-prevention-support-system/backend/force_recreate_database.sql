-- ================================
-- FORCE DROP AND RECREATE DATABASE
-- ================================

-- Kill all connections to the database first
USE master;

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'DrugPreventionDB')
BEGIN
    -- Kill all active connections
    DECLARE @sql NVARCHAR(500) = '';
    SELECT @sql = @sql + 'KILL ' + CONVERT(VARCHAR(10), session_id) + '; '
    FROM sys.dm_exec_sessions 
    WHERE database_id = DB_ID('DrugPreventionDB') AND session_id <> @@SPID;
    
    EXEC (@sql);
    
    -- Set to single user and drop
    ALTER DATABASE DrugPreventionDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE DrugPreventionDB;
    PRINT '🗑️ FORCED DROP completed - DrugPreventionDB database removed';
END

-- Wait a moment
WAITFOR DELAY '00:00:01';

-- Now recreate fresh
CREATE DATABASE DrugPreventionDB COLLATE Vietnamese_CI_AS;
PRINT '🆕 Fresh DrugPreventionDB database created';

-- Switch to new database
USE DrugPreventionDB;
PRINT '📂 Switched to new DrugPreventionDB';

-- Test create a simple table to verify
CREATE TABLE test_table (id INT, name NVARCHAR(50));
INSERT INTO test_table VALUES (1, N'Test Vietnamese: Thành công!');
SELECT * FROM test_table;
DROP TABLE test_table;

PRINT '✅ Database ready for full script execution';
PRINT '👉 Now run the full recreate_database.sql script'; 