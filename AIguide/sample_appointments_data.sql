-- Sample Appointments Data for Testing 1-Hour Slot Validation
-- Make sure to run this after users are created in the system

-- Note: You need to check your actual user IDs first by running:
-- SELECT id, username, first_name, last_name FROM users WHERE username IN ('testuser', 'testconsultant', 'user1', 'consultant1');

-- Sample appointments for testing conflict detection
-- Appointment 1: Today at 9:00 AM (should conflict with 9:00-10:00 slot)
INSERT INTO [appointments] (
    [client_id], 
    [consultant_id], 
    [appointment_date], 
    [duration_minutes], 
    [status], 
    [appointment_type], 
    [client_notes], 
    [consultant_notes], 
    [meeting_link], 
    [fee], 
    [payment_status], 
    [created_at], 
    [updated_at], 
    [payment_method]
) VALUES (
    2,  -- client_id (assuming testuser has ID 2)
    3,  -- consultant_id (assuming testconsultant has ID 3)
    CONVERT(datetime, CONVERT(date, GETDATE()) + ' 09:00:00'), -- Today at 9:00 AM
    60, -- 1 hour duration
    'CONFIRMED',
    'ONLINE',
    'Tôi muốn tư vấn về vấn đề nghiện game và cách cai bỏ',
    'Khách hàng cần hỗ trợ về nghiện hành vi',
    'https://meet.google.com/abc-defg-hij',
    200000, -- 200,000 VND
    'PAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);

-- Appointment 2: Today at 2:00 PM (should conflict with 14:00-15:00 slot)  
INSERT INTO [appointments] (
    [client_id], 
    [consultant_id], 
    [appointment_date], 
    [duration_minutes], 
    [status], 
    [appointment_type], 
    [client_notes], 
    [consultant_notes], 
    [meeting_link], 
    [fee], 
    [payment_status], 
    [created_at], 
    [updated_at], 
    [payment_method]
) VALUES (
    4,  -- client_id (assuming user1 has ID 4)
    3,  -- consultant_id (same consultant)
    CONVERT(datetime, CONVERT(date, GETDATE()) + ' 14:00:00'), -- Today at 2:00 PM
    60, -- 1 hour duration
    'PENDING', 
    'IN_PERSON',
    'Cần tư vấn trực tiếp về vấn đề gia đình và stress',
    NULL,
    NULL,
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);

-- Appointment 3: Tomorrow at 10:00 AM (different consultant)
INSERT INTO [appointments] (
    [client_id], 
    [consultant_id], 
    [appointment_date], 
    [duration_minutes], 
    [status], 
    [appointment_type], 
    [client_notes], 
    [consultant_notes], 
    [meeting_link], 
    [fee], 
    [payment_status], 
    [created_at], 
    [updated_at], 
    [payment_method]
) VALUES (
    2,  -- client_id
    5,  -- consultant_id (assuming consultant1 has ID 5)
    CONVERT(datetime, CONVERT(date, DATEADD(day, 1, GETDATE())) + ' 10:00:00'), -- Tomorrow at 10:00 AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Follow-up session về kế hoạch điều trị',
    'Buổi theo dõi tiến độ',
    'https://zoom.us/j/123456789',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'BANK_TRANSFER'
);

-- Appointment 4: Yesterday (completed appointment for testing)
INSERT INTO [appointments] (
    [client_id], 
    [consultant_id], 
    [appointment_date], 
    [duration_minutes], 
    [status], 
    [appointment_type], 
    [client_notes], 
    [consultant_notes], 
    [meeting_link], 
    [fee], 
    [payment_status], 
    [created_at], 
    [updated_at], 
    [payment_method]
) VALUES (
    4,  -- client_id
    3,  -- consultant_id
    CONVERT(datetime, CONVERT(date, DATEADD(day, -1, GETDATE())) + ' 15:00:00'), -- Yesterday at 3:00 PM
    60,
    'COMPLETED',
    'ONLINE',
    'Buổi tư vấn đầu tiên',
    'Khách hàng đã hiểu rõ vấn đề và có động lực thay đổi. Đã đưa ra kế hoạch điều trị 4 tuần.',
    'https://meet.google.com/xyz-uvw-rst',
    200000,
    'PAID',
    DATEADD(day, -1, GETDATE()),
    GETDATE(),
    'VNPAY'
);

-- Display results to verify
SELECT 
    a.id,
    a.client_id,
    a.consultant_id,
    a.appointment_date,
    a.duration_minutes,
    a.status,
    a.appointment_type,
    a.fee,
    a.payment_status,
    a.payment_method
FROM appointments a
ORDER BY a.appointment_date DESC;

-- Check consultant availability for today (should show conflicts at 9AM and 2PM)
SELECT 
    CONVERT(varchar, appointment_date, 120) as appointment_time,
    duration_minutes,
    status,
    client_notes
FROM appointments 
WHERE consultant_id = 3  -- testconsultant
    AND CONVERT(date, appointment_date) = CONVERT(date, GETDATE())
    AND status IN ('PENDING', 'CONFIRMED')
ORDER BY appointment_date;

PRINT '======================================';
PRINT 'Sample Appointments Created Successfully!';
PRINT '======================================';
PRINT '';
PRINT 'Test Scenarios:';
PRINT '1. Consultant ID 3 (testconsultant) has appointments at:';
PRINT '   - Today 9:00 AM (CONFIRMED) - should block 9AM slot';
PRINT '   - Today 2:00 PM (PENDING) - should block 2PM slot';
PRINT '2. Available slots for today should be: 8AM, 10AM, 11AM, 1PM, 3PM, 4PM, 5PM';
PRINT '3. Try booking at 9AM or 2PM should fail with conflict error';
PRINT '4. Try booking at other times should succeed';
PRINT '';
PRINT 'To test:';
PRINT '1. Login as testuser (client)';  
PRINT '2. Select testconsultant';
PRINT '3. Pick today date';
PRINT '4. Check available time slots';
PRINT '5. Try booking at 9AM (should fail)';
PRINT '6. Try booking at 10AM (should succeed)'; 