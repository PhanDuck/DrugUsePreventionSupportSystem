-- Sample Courses Data for Drug Prevention Support System
-- Run this after creating the database schema

USE DrugPreventionDB;

-- Insert Categories first (if not exists)
IF NOT EXISTS (SELECT 1 FROM categories WHERE id = 1)
INSERT INTO categories (id, name, description, is_active, created_at) VALUES 
(1, N'Phòng chống cơ bản', N'Kiến thức cơ bản về phòng chống tệ nạn xã hội', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM categories WHERE id = 2)
INSERT INTO categories (id, name, description, is_active, created_at) VALUES 
(2, N'Phòng chống nâng cao', N'Kiến thức nâng cao và chuyên sâu', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM categories WHERE id = 3)
INSERT INTO categories (id, name, description, is_active, created_at) VALUES 
(3, N'Hỗ trợ phục hồi', N'Hỗ trợ điều trị và phục hồi', 1, GETDATE());

-- Insert sample instructor (if not exists)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'instructor_demo')
INSERT INTO users (username, email, password, full_name, role_id, is_active, created_at) VALUES 
('instructor_demo', 'instructor@demo.com', '$2a$12$LQv3c1yqBw9LhUhQJrz4Q.m8wY8JBxBo3OKA0mR9fJ9JvVpOdF1lG', N'Giảng viên Demo', 3, 1, GETDATE());

-- Get instructor ID
DECLARE @instructorId BIGINT = (SELECT id FROM users WHERE username = 'instructor_demo');

-- Insert Sample Courses
INSERT INTO courses (
    title, description, instructor_id, category_id, 
    price, difficulty_level, language, is_active, status,
    total_lessons, total_duration_minutes, thumbnail_url,
    max_participants, current_participants, certificate_enabled,
    prerequisites, learning_outcomes, tags,
    created_at, updated_at
) VALUES 
(
    N'Hiểu biết cơ bản về tác hại của ma túy', 
    N'Khóa học cung cấp kiến thức cơ bản về các loại ma túy, tác hại và cách phòng tránh. Phù hợp cho học sinh, sinh viên và người dân.',
    @instructorId, 1, 0.00, 'BEGINNER', 'vi', 1, 'open',
    8, 240, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    100, 0, 1,
    N'Không có yêu cầu tiên quyết',
    N'Hiểu được tác hại của ma túy, biết cách phòng tránh và nhận diện dấu hiệu',
    N'ma túy, phòng chống, cơ bản, giáo dục',
    GETDATE(), GETDATE()
),
(
    N'Kỹ năng tư vấn và hỗ trợ người nghiện', 
    N'Khóa học nâng cao dành cho nhân viên y tế, tư vấn viên để học các kỹ năng hỗ trợ người nghiện ma túy.',
    @instructorId, 2, 500000.00, 'INTERMEDIATE', 'vi', 1, 'open',
    12, 600, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    50, 0, 1,
    N'Có kiến thức cơ bản về tâm lý học hoặc y học',
    N'Nắm vững kỹ năng tư vấn, biết cách tiếp cận và hỗ trợ người nghiện',
    N'tư vấn, hỗ trợ, kỹ năng, nghiện ma túy',
    GETDATE(), GETDATE()
),
(
    N'Chương trình phục hồi và tái hòa nhập', 
    N'Khóa học về các phương pháp điều trị, phục hồi và giúp người nghiện tái hòa nhập cộng đồng.',
    @instructorId, 3, 750000.00, 'ADVANCED', 'vi', 1, 'open',
    15, 900, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    30, 0, 1,
    N'Đã hoàn thành khóa học cơ bản hoặc có kinh nghiệm trong lĩnh vực',
    N'Biết cách thiết kế và thực hiện chương trình phục hồi hiệu quả',
    N'phục hồi, tái hòa nhập, điều trị, cộng đồng',
    GETDATE(), GETDATE()
),
(
    N'Nhận diện sớm dấu hiệu nghiện', 
    N'Khóa học miễn phí giúp phụ huynh, giáo viên nhận diện sớm các dấu hiệu nghiện ở trẻ em, thanh thiếu niên.',
    @instructorId, 1, 0.00, 'BEGINNER', 'vi', 1, 'open',
    6, 180, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    200, 0, 1,
    N'Không có yêu cầu tiên quyết',
    N'Biết cách nhận diện dấu hiệu nghiện và xử lý ban đầu',
    N'nhận diện, dấu hiệu, phòng ngừa, gia đình',
    GETDATE(), GETDATE()
),
(
    N'Pháp luật về ma túy và trách nhiệm xã hội', 
    N'Tìm hiểu về khung pháp lý liên quan đến ma túy, trách nhiệm của cá nhân và tổ chức trong phòng chống tệ nạn.',
    @instructorId, 2, 300000.00, 'INTERMEDIATE', 'vi', 1, 'open',
    10, 400, 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400',
    80, 0, 1,
    N'Có hiểu biết cơ bản về pháp luật',
    N'Nắm vững các quy định pháp luật và biết cách áp dụng trong thực tế',
    N'pháp luật, trách nhiệm, quy định, xã hội',
    GETDATE(), GETDATE()
);

-- Insert some sample lessons for the first course
DECLARE @courseId1 BIGINT = (SELECT TOP 1 id FROM courses WHERE title LIKE N'%Hiểu biết cơ bản%');

INSERT INTO course_lessons (
    course_id, title, description, lesson_order, estimated_duration,
    is_published, is_free, required_completion, learning_objectives,
    created_at, updated_at
) VALUES 
(@courseId1, N'Giới thiệu về ma túy', N'Khái niệm cơ bản và phân loại ma túy', 1, 30, 1, 1, 1,
 N'Hiểu được khái niệm và các loại ma túy cơ bản', GETDATE(), GETDATE()),
(@courseId1, N'Tác hại của ma túy đối với sức khỏe', N'Ảnh hưởng của ma túy lên cơ thể và tinh thần', 2, 45, 1, 0, 1,
 N'Nhận thức được tác hại nghiêm trọng của ma túy', GETDATE(), GETDATE()),
(@courseId1, N'Nguyên nhân dẫn đến nghiện', N'Các yếu tố tâm lý, xã hội dẫn đến nghiện ma túy', 3, 40, 1, 0, 1,
 N'Hiểu được các nguyên nhân chính gây nghiện', GETDATE(), GETDATE());

PRINT 'Sample courses data inserted successfully!';
PRINT 'Total courses: ' + CAST((SELECT COUNT(*) FROM courses) AS VARCHAR);
PRINT 'Total lessons: ' + CAST((SELECT COUNT(*) FROM course_lessons) AS VARCHAR); 