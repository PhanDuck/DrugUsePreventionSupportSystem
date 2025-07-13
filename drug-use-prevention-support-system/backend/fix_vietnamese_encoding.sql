-- ============================================
-- FIX VIETNAMESE ENCODING ISSUES
-- ============================================

USE DrugPreventionDB;
GO

-- 1. Check current database collation
SELECT name, collation_name 
FROM sys.databases 
WHERE name = 'DrugPreventionDB';

-- 2. Check table collations
SELECT 
    t.name AS table_name,
    c.name AS column_name,
    c.collation_name
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
WHERE c.collation_name IS NOT NULL
ORDER BY t.name, c.name;

-- 3. Update database collation if needed
-- ALTER DATABASE DrugPreventionDB COLLATE Vietnamese_CI_AS;

-- 4. Update specific columns to use proper collation
-- This will fix any existing data with encoding issues

-- Update users table
ALTER TABLE users 
ALTER COLUMN username NVARCHAR(255) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN email NVARCHAR(255) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN first_name NVARCHAR(50) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN last_name NVARCHAR(50) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN phone NVARCHAR(20) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN address NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN gender NVARCHAR(10) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN degree NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN expertise NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE users 
ALTER COLUMN bio NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update roles table
ALTER TABLE roles 
ALTER COLUMN name NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Update categories table
ALTER TABLE categories 
ALTER COLUMN name NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE categories 
ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE categories 
ALTER COLUMN icon NVARCHAR(100) COLLATE Vietnamese_CI_AS;

-- Update assessments table
ALTER TABLE assessments 
ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessments 
ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update assessment_questions table
ALTER TABLE assessment_questions 
ALTER COLUMN question NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_questions 
ALTER COLUMN question_type NVARCHAR(50) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_questions 
ALTER COLUMN options_json NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update assessment_results table
ALTER TABLE assessment_results 
ALTER COLUMN risk_level NVARCHAR(50) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_results 
ALTER COLUMN recommendations NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_results 
ALTER COLUMN answers_json NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update answers table
ALTER TABLE answers 
ALTER COLUMN answer_text NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update courses table
ALTER TABLE courses 
ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

ALTER TABLE courses 
ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE courses 
ALTER COLUMN duration NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE courses 
ALTER COLUMN image_url NVARCHAR(500) COLLATE Vietnamese_CI_AS;

ALTER TABLE courses 
ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Update course_registrations table
ALTER TABLE course_registrations 
ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

ALTER TABLE course_registrations 
ALTER COLUMN notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Update appointments table
ALTER TABLE appointments 
ALTER COLUMN status NVARCHAR(20) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN appointment_type NVARCHAR(50) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN client_notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN consultant_notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN meeting_link NVARCHAR(500) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN payment_status NVARCHAR(20) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN cancellation_reason NVARCHAR(500) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN vnpay_txn_ref NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN vnpay_response_code NVARCHAR(10) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN vnpay_transaction_no NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN vnpay_bank_code NVARCHAR(20) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN payment_url NVARCHAR(1000) COLLATE Vietnamese_CI_AS;

ALTER TABLE appointments 
ALTER COLUMN payment_method NVARCHAR(50) COLLATE Vietnamese_CI_AS;

-- Update blogs table
ALTER TABLE blogs 
ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

ALTER TABLE blogs 
ALTER COLUMN content NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE blogs 
ALTER COLUMN author_id BIGINT; -- This is a foreign key, no collation needed

ALTER TABLE blogs 
ALTER COLUMN category_id BIGINT; -- This is a foreign key, no collation needed

ALTER TABLE blogs 
ALTER COLUMN image_url NVARCHAR(500) COLLATE Vietnamese_CI_AS;

ALTER TABLE blogs 
ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

ALTER TABLE blogs 
ALTER COLUMN tags NVARCHAR(500) COLLATE Vietnamese_CI_AS;

-- Update recommendations table
ALTER TABLE recommendations 
ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

ALTER TABLE recommendations 
ALTER COLUMN content NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE recommendations 
ALTER COLUMN category NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE recommendations 
ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Update assessment_types table
ALTER TABLE assessment_types 
ALTER COLUMN name NVARCHAR(100) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_types 
ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

ALTER TABLE assessment_types 
ALTER COLUMN target_age_group NVARCHAR(50) COLLATE Vietnamese_CI_AS;

-- Update reviews table
ALTER TABLE reviews 
ALTER COLUMN comment NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

PRINT '✅ Vietnamese encoding fixes applied successfully!';
PRINT '🔤 All text columns now use Vietnamese_CI_AS collation';
PRINT '📝 Vietnamese characters should now display correctly'; 