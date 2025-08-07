-- Sample Course Content Data for Drug Prevention Support System
-- Run this after creating the database schema and sample courses

USE DrugPreventionDB;

-- Get course ID 1 and lesson IDs
DECLARE @courseId BIGINT = 1;
DECLARE @lesson1Id BIGINT = (SELECT TOP 1 id FROM course_lessons WHERE course_id = @courseId AND lesson_order = 1);
DECLARE @lesson2Id BIGINT = (SELECT TOP 1 id FROM course_lessons WHERE course_id = @courseId AND lesson_order = 2);
DECLARE @lesson3Id BIGINT = (SELECT TOP 1 id FROM course_lessons WHERE course_id = @courseId AND lesson_order = 3);

PRINT 'Course ID: ' + CAST(@courseId AS VARCHAR);
PRINT 'Lesson 1 ID: ' + CAST(@lesson1Id AS VARCHAR);
PRINT 'Lesson 2 ID: ' + CAST(@lesson2Id AS VARCHAR);
PRINT 'Lesson 3 ID: ' + CAST(@lesson3Id AS VARCHAR);

-- Insert sample content for lesson 1 (Video content)
IF @lesson1Id IS NOT NULL
BEGIN
    INSERT INTO course_contents (
        course_id, lesson_id, title, description, content_type,
        video_url, video_duration, video_thumbnail,
        text_content, content_order, is_published, is_free,
        required_completion, estimated_duration, created_at, updated_at
    ) VALUES (
        @courseId, @lesson1Id, 
        N'Video giới thiệu về ma túy', 
        N'Video ngắn giới thiệu về các loại ma túy phổ biến và tác hại của chúng',
        'VIDEO',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ', -- Sample YouTube URL
        180, -- 3 minutes
        'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        NULL, -- No text content for video
        1, 1, 1, 1, 3, GETDATE(), GETDATE()
    );
    PRINT 'Video content added for lesson 1';
END

-- Insert sample content for lesson 2 (Text content)
IF @lesson2Id IS NOT NULL
BEGIN
    INSERT INTO course_contents (
        course_id, lesson_id, title, description, content_type,
        video_url, video_duration, video_thumbnail,
        text_content, content_order, is_published, is_free,
        required_completion, estimated_duration, created_at, updated_at
    ) VALUES (
        @courseId, @lesson2Id, 
        N'Nội dung về tác hại ma túy', 
        N'Bài đọc chi tiết về tác hại của ma túy đối với sức khỏe',
        'TEXT',
        NULL, NULL, NULL,
        N'<h3>Tác hại của ma túy đối với sức khỏe</h3>
        <p>Ma túy có tác hại nghiêm trọng đến sức khỏe con người:</p>
        <ul>
            <li><strong>Tác hại về thể chất:</strong> Suy giảm hệ miễn dịch, tổn thương gan, thận, tim mạch</li>
            <li><strong>Tác hại về tinh thần:</strong> Rối loạn tâm thần, trầm cảm, lo âu</li>
            <li><strong>Tác hại về xã hội:</strong> Mất việc làm, tan vỡ gia đình, phạm pháp</li>
        </ul>
        <p>Việc sử dụng ma túy có thể dẫn đến:</p>
        <ol>
            <li>Nghiện ma túy</li>
            <li>Quá liều và tử vong</li>
            <li>Lây nhiễm HIV/AIDS</li>
            <li>Bệnh tâm thần</li>
        </ol>',
        1, 1, 0, 1, 5, GETDATE(), GETDATE()
    );
    PRINT 'Text content added for lesson 2';
END

-- Insert sample content for lesson 3 (Meet link content)
IF @lesson3Id IS NOT NULL
BEGIN
    INSERT INTO course_contents (
        course_id, lesson_id, title, description, content_type,
        video_url, video_duration, video_thumbnail,
        text_content, meet_link, meet_start_time, meet_end_time, meet_password,
        content_order, is_published, is_free,
        required_completion, estimated_duration, created_at, updated_at
    ) VALUES (
        @courseId, @lesson3Id, 
        N'Buổi tư vấn trực tuyến', 
        N'Buổi tư vấn trực tuyến với chuyên gia về nguyên nhân dẫn đến nghiện ma túy',
        'MEET_LINK',
        NULL, NULL, NULL,
        N'Tham gia buổi tư vấn trực tuyến với chuyên gia để hiểu rõ hơn về các nguyên nhân dẫn đến nghiện ma túy.',
        'https://meet.google.com/abc-defg-hij',
        DATEADD(day, 7, GETDATE()), -- Start time: 7 days from now
        DATEADD(day, 7, DATEADD(hour, 1, GETDATE())), -- End time: 7 days + 1 hour from now
        '123456',
        1, 1, 0, 1, 60, GETDATE(), GETDATE()
    );
    PRINT 'Meet link content added for lesson 3';
END

-- Show inserted content
SELECT 
    cc.id,
    cc.title,
    cc.content_type,
    cc.is_published,
    cc.is_free,
    cc.required_completion,
    cl.title as lesson_title,
    cl.lesson_order
FROM course_contents cc
JOIN course_lessons cl ON cc.lesson_id = cl.id
WHERE cc.course_id = @courseId
ORDER BY cl.lesson_order, cc.content_order;

PRINT 'Sample course content inserted successfully!';
PRINT 'Total content items: ' + CAST((SELECT COUNT(*) FROM course_contents WHERE course_id = @courseId) AS VARCHAR); 