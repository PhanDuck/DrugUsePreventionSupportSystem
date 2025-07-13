-- ============================================
-- SAFE VIETNAMESE ENCODING FIX
-- Only updates columns that actually exist
-- ============================================

USE DrugPreventionDB;
GO

-- 1. Check current database collation
SELECT name, collation_name 
FROM sys.databases 
WHERE name = 'DrugPreventionDB';

-- 2. Fix encoding for existing columns only
-- Users table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'username')
    ALTER TABLE users ALTER COLUMN username NVARCHAR(255) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'email')
    ALTER TABLE users ALTER COLUMN email NVARCHAR(255) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'first_name')
    ALTER TABLE users ALTER COLUMN first_name NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'last_name')
    ALTER TABLE users ALTER COLUMN last_name NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'phone')
    ALTER TABLE users ALTER COLUMN phone NVARCHAR(20) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'address')
    ALTER TABLE users ALTER COLUMN address NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'gender')
    ALTER TABLE users ALTER COLUMN gender NVARCHAR(10) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'degree')
    ALTER TABLE users ALTER COLUMN degree NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'expertise')
    ALTER TABLE users ALTER COLUMN expertise NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'bio')
    ALTER TABLE users ALTER COLUMN bio NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Roles table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('roles') AND name = 'name')
    ALTER TABLE roles ALTER COLUMN name NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Categories table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('categories') AND name = 'name')
    ALTER TABLE categories ALTER COLUMN name NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('categories') AND name = 'description')
    ALTER TABLE categories ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('categories') AND name = 'icon')
    ALTER TABLE categories ALTER COLUMN icon NVARCHAR(100) COLLATE Vietnamese_CI_AS;

-- Assessments table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessments') AND name = 'title')
    ALTER TABLE assessments ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessments') AND name = 'description')
    ALTER TABLE assessments ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Assessment questions table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_questions') AND name = 'question')
    ALTER TABLE assessment_questions ALTER COLUMN question NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_questions') AND name = 'question_type')
    ALTER TABLE assessment_questions ALTER COLUMN question_type NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_questions') AND name = 'options_json')
    ALTER TABLE assessment_questions ALTER COLUMN options_json NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Assessment results table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_results') AND name = 'risk_level')
    ALTER TABLE assessment_results ALTER COLUMN risk_level NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_results') AND name = 'recommendations')
    ALTER TABLE assessment_results ALTER COLUMN recommendations NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_results') AND name = 'answers_json')
    ALTER TABLE assessment_results ALTER COLUMN answers_json NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Answers table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('answers') AND name = 'answer_text')
    ALTER TABLE answers ALTER COLUMN answer_text NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Courses table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('courses') AND name = 'title')
    ALTER TABLE courses ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('courses') AND name = 'description')
    ALTER TABLE courses ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('courses') AND name = 'duration')
    ALTER TABLE courses ALTER COLUMN duration NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('courses') AND name = 'image_url')
    ALTER TABLE courses ALTER COLUMN image_url NVARCHAR(500) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('courses') AND name = 'status')
    ALTER TABLE courses ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Course registrations table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_registrations') AND name = 'status')
    ALTER TABLE course_registrations ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_registrations') AND name = 'notes')
    ALTER TABLE course_registrations ALTER COLUMN notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

-- Appointments table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'status')
    ALTER TABLE appointments ALTER COLUMN status NVARCHAR(20) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'appointment_type')
    ALTER TABLE appointments ALTER COLUMN appointment_type NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'client_notes')
    ALTER TABLE appointments ALTER COLUMN client_notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'consultant_notes')
    ALTER TABLE appointments ALTER COLUMN consultant_notes NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'meeting_link')
    ALTER TABLE appointments ALTER COLUMN meeting_link NVARCHAR(500) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'payment_status')
    ALTER TABLE appointments ALTER COLUMN payment_status NVARCHAR(20) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'cancellation_reason')
    ALTER TABLE appointments ALTER COLUMN cancellation_reason NVARCHAR(500) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'vnpay_txn_ref')
    ALTER TABLE appointments ALTER COLUMN vnpay_txn_ref NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'vnpay_response_code')
    ALTER TABLE appointments ALTER COLUMN vnpay_response_code NVARCHAR(10) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'vnpay_transaction_no')
    ALTER TABLE appointments ALTER COLUMN vnpay_transaction_no NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'vnpay_bank_code')
    ALTER TABLE appointments ALTER COLUMN vnpay_bank_code NVARCHAR(20) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'payment_url')
    ALTER TABLE appointments ALTER COLUMN payment_url NVARCHAR(1000) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('appointments') AND name = 'payment_method')
    ALTER TABLE appointments ALTER COLUMN payment_method NVARCHAR(50) COLLATE Vietnamese_CI_AS;

-- Blogs table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('blogs') AND name = 'title')
    ALTER TABLE blogs ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('blogs') AND name = 'content')
    ALTER TABLE blogs ALTER COLUMN content NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('blogs') AND name = 'image_url')
    ALTER TABLE blogs ALTER COLUMN image_url NVARCHAR(500) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('blogs') AND name = 'status')
    ALTER TABLE blogs ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('blogs') AND name = 'tags')
    ALTER TABLE blogs ALTER COLUMN tags NVARCHAR(500) COLLATE Vietnamese_CI_AS;

-- Recommendations table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('recommendations') AND name = 'title')
    ALTER TABLE recommendations ALTER COLUMN title NVARCHAR(200) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('recommendations') AND name = 'description')
    ALTER TABLE recommendations ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('recommendations') AND name = 'recommendation_type')
    ALTER TABLE recommendations ALTER COLUMN recommendation_type NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('recommendations') AND name = 'risk_level')
    ALTER TABLE recommendations ALTER COLUMN risk_level NVARCHAR(50) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('recommendations') AND name = 'status')
    ALTER TABLE recommendations ALTER COLUMN status NVARCHAR(255) COLLATE Vietnamese_CI_AS;

-- Assessment types table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_types') AND name = 'name')
    ALTER TABLE assessment_types ALTER COLUMN name NVARCHAR(100) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_types') AND name = 'description')
    ALTER TABLE assessment_types ALTER COLUMN description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('assessment_types') AND name = 'target_age_group')
    ALTER TABLE assessment_types ALTER COLUMN target_age_group NVARCHAR(50) COLLATE Vietnamese_CI_AS;

-- Reviews table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('reviews') AND name = 'comment')
    ALTER TABLE reviews ALTER COLUMN comment NVARCHAR(MAX) COLLATE Vietnamese_CI_AS;

PRINT '✅ Safe Vietnamese encoding fixes applied successfully!';
PRINT '🔤 All existing text columns now use Vietnamese_CI_AS collation';
PRINT '📝 Vietnamese characters should now display correctly'; 