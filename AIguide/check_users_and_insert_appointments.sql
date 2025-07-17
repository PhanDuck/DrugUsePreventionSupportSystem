-- Complete script to check users and create sample appointments
-- for testing 1-hour slot validation system

PRINT '========================================';
PRINT 'Drug Prevention System - Appointment Test Data';
PRINT '========================================';
PRINT '';

-- Step 1: Check existing users
PRINT 'Step 1: Checking existing users...';
SELECT 
    id, 
    username, 
    first_name + ' ' + last_name as full_name,
    email,
    r.name as role
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE r.name IN ('USER', 'CONSULTANT')
ORDER BY r.name, u.id;

-- Step 2: Get specific user IDs for our test accounts
DECLARE @client1_id INT, @client2_id INT, @consultant1_id INT, @consultant2_id INT;

-- Find client users (role = USER)
SELECT TOP 1 @client1_id = u.id 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE r.name = 'USER' 
ORDER BY u.id;

SELECT @client2_id = u.id 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE r.name = 'USER' AND u.id > @client1_id
ORDER BY u.id;

-- Find consultant users (role = CONSULTANT)  
SELECT TOP 1 @consultant1_id = u.id 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE r.name = 'CONSULTANT' 
ORDER BY u.id;

SELECT @consultant2_id = u.id 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE r.name = 'CONSULTANT' AND u.id > @consultant1_id
ORDER BY u.id;

-- Display found IDs
PRINT '';
PRINT 'Step 2: Found user IDs:';
PRINT 'Client 1 ID: ' + ISNULL(CAST(@client1_id AS VARCHAR), 'NOT FOUND');
PRINT 'Client 2 ID: ' + ISNULL(CAST(@client2_id AS VARCHAR), 'NOT FOUND');  
PRINT 'Consultant 1 ID: ' + ISNULL(CAST(@consultant1_id AS VARCHAR), 'NOT FOUND');
PRINT 'Consultant 2 ID: ' + ISNULL(CAST(@consultant2_id AS VARCHAR), 'NOT FOUND');

-- Check if we have enough users
IF @client1_id IS NULL OR @consultant1_id IS NULL
BEGIN
    PRINT '';
    PRINT 'ERROR: Not enough users found!';
    PRINT 'Please create at least 1 USER and 1 CONSULTANT first.';
    PRINT 'You can use the create-test-accounts script.';
    RETURN;
END

-- Step 3: Create sample appointments
PRINT '';
PRINT 'Step 3: Creating sample appointments...';

-- Clean up any existing test appointments (optional)
-- DELETE FROM appointments WHERE client_id IN (@client1_id, @client2_id);

-- Appointment 1: Today at 9:00 AM (Conflict test)
INSERT INTO appointments (
    client_id, 
    consultant_id, 
    appointment_date, 
    duration_minutes, 
    status, 
    appointment_type, 
    client_notes, 
    consultant_notes, 
    meeting_link, 
    fee, 
    payment_status, 
    created_at, 
    updated_at, 
    payment_method
) VALUES (
    @client1_id,
    @consultant1_id,
    CONVERT(datetime, CONVERT(date, GETDATE()) + ' 09:00:00'), -- Today 9AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Tư vấn về vấn đề nghiện game online và ảnh hưởng đến học tập',
    'Khách hàng cần hỗ trợ về nghiện hành vi, đã đánh giá mức độ nghiêm trọng',
    'https://meet.google.com/abc-defg-hij',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ Appointment 1 created: Today 9:00 AM (CONFIRMED)';

-- Appointment 2: Today at 2:00 PM (Conflict test)
INSERT INTO appointments (
    client_id, 
    consultant_id, 
    appointment_date, 
    duration_minutes, 
    status, 
    appointment_type, 
    client_notes, 
    fee, 
    payment_status, 
    created_at, 
    updated_at, 
    payment_method
) VALUES (
    ISNULL(@client2_id, @client1_id), -- Use client2 if available, otherwise client1
    @consultant1_id,
    CONVERT(datetime, CONVERT(date, GETDATE()) + ' 14:00:00'), -- Today 2PM
    60,
    'PENDING',
    'IN_PERSON',
    'Cần tư vấn về stress và áp lực từ gia đình, có dấu hiệu trầm cảm nhẹ',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ Appointment 2 created: Today 2:00 PM (PENDING)';

-- Appointment 3: Tomorrow at 10:00 AM (Different consultant test)
IF @consultant2_id IS NOT NULL
BEGIN
    INSERT INTO appointments (
        client_id, 
        consultant_id, 
        appointment_date, 
        duration_minutes, 
        status, 
        appointment_type, 
        client_notes, 
        consultant_notes,
        meeting_link,
        fee, 
        payment_status, 
        created_at, 
        updated_at, 
        payment_method
    ) VALUES (
        @client1_id,
        @consultant2_id, -- Different consultant
        CONVERT(datetime, CONVERT(date, DATEADD(day, 1, GETDATE())) + ' 10:00:00'), -- Tomorrow 10AM
        60,
        'CONFIRMED',
        'ONLINE',
        'Buổi follow-up sau 2 tuần điều trị, kiểm tra tiến độ phục hồi',
        'Khách hàng đã có tiến triển tích cực, tiếp tục theo dõi',
        'https://zoom.us/j/123456789',
        200000,
        'PAID',
        GETDATE(),
        GETDATE(),
        'BANK_TRANSFER'
    );
    PRINT '✅ Appointment 3 created: Tomorrow 10:00 AM with different consultant';
END

-- Appointment 4: Yesterday (Completed - for history test)
INSERT INTO appointments (
    client_id, 
    consultant_id, 
    appointment_date, 
    duration_minutes, 
    status, 
    appointment_type, 
    client_notes, 
    consultant_notes, 
    meeting_link, 
    fee, 
    payment_status, 
    created_at, 
    updated_at, 
    payment_method
) VALUES (
    @client1_id,
    @consultant1_id,
    CONVERT(datetime, CONVERT(date, DATEADD(day, -1, GETDATE())) + ' 15:00:00'), -- Yesterday 3PM
    60,
    'COMPLETED',
    'ONLINE',
    'Buổi tư vấn đầu tiên, tìm hiểu vấn đề và đánh giá ban đầu',
    'Khách hàng hợp tác tốt, đã xác định được vấn đề chính. Lên kế hoạch điều trị 4 tuần.',
    'https://meet.google.com/xyz-uvw-rst',
    200000,
    'PAID',
    DATEADD(day, -1, GETDATE()),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ Appointment 4 created: Yesterday 3:00 PM (COMPLETED)';

-- Step 4: Display results
PRINT '';
PRINT 'Step 4: Verification - All appointments created:';
SELECT 
    a.id,
    'Client ' + CAST(a.client_id AS VARCHAR) as client,
    'Consultant ' + CAST(a.consultant_id AS VARCHAR) as consultant,
    CONVERT(varchar, a.appointment_date, 120) as appointment_time,
    a.duration_minutes as duration,
    a.status,
    a.appointment_type as type,
    a.fee,
    a.payment_status as payment
FROM appointments a
WHERE a.created_at >= CONVERT(date, GETDATE()) -- Today's inserts
ORDER BY a.appointment_date;

-- Step 5: Test scenario summary
PRINT '';
PRINT '========================================';
PRINT 'TEST SCENARIOS READY!';
PRINT '========================================';
PRINT '';
PRINT 'Consultant ' + CAST(@consultant1_id AS VARCHAR) + ' schedule for TODAY:';

SELECT 
    CONVERT(varchar, appointment_date, 108) as time_slot,
    status,
    appointment_type,
    LEFT(client_notes, 50) + '...' as notes_preview
FROM appointments 
WHERE consultant_id = @consultant1_id
    AND CONVERT(date, appointment_date) = CONVERT(date, GETDATE())
    AND status IN ('PENDING', 'CONFIRMED')
ORDER BY appointment_date;

PRINT '';
PRINT 'Expected available time slots for TODAY:';
PRINT '✅ 08:00 - 09:00 (Available)';
PRINT '❌ 09:00 - 10:00 (BOOKED - CONFIRMED)';
PRINT '✅ 10:00 - 11:00 (Available)';
PRINT '✅ 11:00 - 12:00 (Available)';
PRINT '✅ 13:00 - 14:00 (Available)';
PRINT '❌ 14:00 - 15:00 (BOOKED - PENDING)';
PRINT '✅ 15:00 - 16:00 (Available)';
PRINT '✅ 16:00 - 17:00 (Available)';
PRINT '✅ 17:00 - 18:00 (Available)';
PRINT '';
PRINT 'TO TEST VALIDATION:';
PRINT '1. Login as client (User ID: ' + CAST(@client1_id AS VARCHAR) + ')';
PRINT '2. Select consultant (ID: ' + CAST(@consultant1_id AS VARCHAR) + ')';
PRINT '3. Pick today''s date';
PRINT '4. Try booking at 09:00 → Should FAIL (conflict)';
PRINT '5. Try booking at 14:00 → Should FAIL (conflict)';  
PRINT '6. Try booking at 10:00 → Should SUCCESS';
PRINT '7. Check UI shows 7 available slots (not 9)';
PRINT '';
PRINT '🎯 Ready for testing! Good luck! 🎯'; 