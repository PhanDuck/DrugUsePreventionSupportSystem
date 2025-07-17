-- Insert Future Appointments with CORRECT User IDs
-- Based on actual database: testuser (ID 12) and tuvan (ID 14)

PRINT '========================================';
PRINT 'Inserting FUTURE Appointments with CORRECT User IDs';
PRINT '========================================';
PRINT '';

-- Clean up future appointments (handle foreign key constraint)
BEGIN TRY
    DELETE FROM appointments WHERE appointment_date > GETDATE();
    PRINT 'Cleaned up existing future appointments';
END TRY
BEGIN CATCH
    PRINT 'Warning: Some appointments have payment records (foreign key constraint)';
    PRINT 'Continuing with new appointments...';
END CATCH

-- Use CORRECT user IDs from your database
DECLARE @client_id INT = 12;        -- testuser (USER role)
DECLARE @consultant_id INT = 14;    -- tuvan (CONSULTANT role)

PRINT 'Using CORRECT user IDs:';
PRINT 'Client: testuser (ID 12)';
PRINT 'Consultant: tuvan (ID 14)';
PRINT '';

-- ========================================
-- TODAY'S APPOINTMENTS (for conflict testing)
-- ========================================

-- Appointment 1: TODAY at 9:00 AM (should block 9AM slot)
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
    @client_id,
    @consultant_id,
    DATEADD(hour, 9, CAST(CAST(GETDATE() AS DATE) AS DATETIME)), -- Today 9:00 AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Tư vấn về vấn đề nghiện game và ảnh hưởng đến học tập',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TODAY 09:00 AM - testuser + tuvan (CONFIRMED)';

-- Appointment 2: TODAY at 2:00 PM (should block 2PM slot)
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
    @client_id,
    @consultant_id,
    DATEADD(hour, 14, CAST(CAST(GETDATE() AS DATE) AS DATETIME)), -- Today 2:00 PM
    60,
    'PENDING',
    'IN_PERSON',
    'Tư vấn về stress và áp lực từ gia đình',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TODAY 02:00 PM - testuser + tuvan (PENDING)';

-- ========================================
-- TOMORROW'S APPOINTMENTS
-- ========================================

-- Appointment 3: TOMORROW at 10:00 AM
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
    @client_id,
    @consultant_id,
    DATEADD(hour, 10, CAST(CAST(DATEADD(day, 1, GETDATE()) AS DATE) AS DATETIME)), -- Tomorrow 10:00 AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Buổi follow-up sau 1 tuần điều trị',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'BANK_TRANSFER'
);
PRINT '✅ TOMORROW 10:00 AM - testuser + tuvan (CONFIRMED)';

-- Appointment 4: TOMORROW at 3:00 PM
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
    @client_id,
    @consultant_id,
    DATEADD(hour, 15, CAST(CAST(DATEADD(day, 1, GETDATE()) AS DATE) AS DATETIME)), -- Tomorrow 3:00 PM
    60,
    'PENDING',
    'ONLINE',
    'Tư vấn tâm lý về quản lý cảm xúc',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TOMORROW 03:00 PM - testuser + tuvan (PENDING)';

-- ========================================
-- NEXT WEEK APPOINTMENT
-- ========================================

-- Appointment 5: NEXT WEEK at 11:00 AM
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
    @client_id,
    @consultant_id,
    DATEADD(hour, 11, CAST(CAST(DATEADD(day, 7, GETDATE()) AS DATE) AS DATETIME)), -- Next week 11:00 AM
    60,
    'PENDING',
    'IN_PERSON',
    'Kiểm tra tiến độ và đánh giá hiệu quả điều trị',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ NEXT WEEK 11:00 AM - testuser + tuvan (PENDING)';

-- Display all new future appointments
PRINT '';
PRINT '========================================';
PRINT 'NEW FUTURE APPOINTMENTS CREATED:';
PRINT '========================================';

SELECT 
    a.id,
    u1.username as client_username,
    u2.username as consultant_username,
    CONVERT(varchar, a.appointment_date, 120) as appointment_time,
    DATENAME(weekday, a.appointment_date) as day_of_week,
    a.duration_minutes,
    a.status,
    a.appointment_type,
    a.fee,
    a.payment_status,
    LEFT(a.client_notes, 50) + '...' as notes_preview
FROM appointments a
LEFT JOIN users u1 ON a.client_id = u1.id
LEFT JOIN users u2 ON a.consultant_id = u2.id
WHERE a.appointment_date > GETDATE()
    AND a.client_id = 12 -- testuser
    AND a.consultant_id = 14 -- tuvan
ORDER BY a.appointment_date;

-- Show TODAY's schedule for tuvan (consultant ID 14)
PRINT '';
PRINT 'TODAY''S SCHEDULE - Consultant tuvan (ID 14):';
SELECT 
    CONVERT(varchar, appointment_date, 108) as time_slot,
    status,
    appointment_type,
    LEFT(client_notes, 30) + '...' as notes
FROM appointments 
WHERE consultant_id = 14
    AND CONVERT(date, appointment_date) = CONVERT(date, GETDATE())
    AND status IN ('PENDING', 'CONFIRMED')
ORDER BY appointment_date;

PRINT '';
PRINT '========================================';
PRINT 'TESTING SCENARIOS with CORRECT Users:';
PRINT '========================================';
PRINT '';
PRINT 'FOR TODAY (Consultant: tuvan - ID 14):';
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
PRINT 'EXPECTED UI BEHAVIOR:';
PRINT '- Total slots available: 7 (out of 9)';
PRINT '- Blocked slots: 09:00, 14:00';
PRINT '';
PRINT 'TO TEST VALIDATION SYSTEM:';
PRINT '1. Login frontend as: testuser (password từ database)';
PRINT '2. Go to Appointments page';
PRINT '3. Select consultant: tuvan';
PRINT '4. Pick TODAY''s date';
PRINT '5. Should see only 7 time slots displayed';
PRINT '6. Try booking 09:00 → Should FAIL with conflict error';
PRINT '7. Try booking 14:00 → Should FAIL with conflict error';
PRINT '8. Try booking 10:00 → Should SUCCESS';
PRINT '';
PRINT '🎯 Ready to test with correct testuser + tuvan accounts!';

-- Final verification
PRINT '';
PRINT 'Final check - appointments for testuser + tuvan:';
SELECT 
    COUNT(*) as total_future_appointments,
    COUNT(CASE WHEN CONVERT(date, appointment_date) = CONVERT(date, GETDATE()) THEN 1 END) as today_appointments
FROM appointments 
WHERE appointment_date > DATEADD(hour, -1, GETDATE())
    AND client_id = 12 
    AND consultant_id = 14; 