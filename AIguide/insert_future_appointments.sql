-- Insert Future Appointments for Testing 1-Hour Slot Validation
-- Clear future appointments first to avoid duplicates

PRINT '========================================';
PRINT 'Inserting FUTURE Appointments for Testing';
PRINT '========================================';
PRINT '';

-- Clean up future appointments (keep historical data)
DELETE FROM appointments WHERE appointment_date > GETDATE();
PRINT 'Cleaned up existing future appointments';

-- Get user IDs from existing data (using what you have)
DECLARE @client1_id INT = 2;  -- Based on your screenshot
DECLARE @client2_id INT = 3;  
DECLARE @consultant1_id INT = 5; -- Based on your screenshot
DECLARE @consultant2_id INT = 6;

PRINT 'Using existing user IDs from your database';

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
    @client1_id,
    @consultant1_id,
    DATEADD(hour, 9, CAST(CAST(GETDATE() AS DATE) AS DATETIME)), -- Today 9:00 AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Consultation about gaming addiction and study impact',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TODAY 09:00 AM - CONFIRMED (should block 9AM slot)';

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
    @client2_id,
    @consultant1_id,
    DATEADD(hour, 14, CAST(CAST(GETDATE() AS DATE) AS DATETIME)), -- Today 2:00 PM
    60,
    'PENDING',
    'IN_PERSON',
    'Family counseling session for stress management',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TODAY 02:00 PM - PENDING (should block 2PM slot)';

-- ========================================
-- TOMORROW'S APPOINTMENTS
-- ========================================

-- Appointment 3: TOMORROW at 10:00 AM (different consultant)
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
    @client1_id,
    @consultant2_id, -- Different consultant
    DATEADD(hour, 10, CAST(CAST(DATEADD(day, 1, GETDATE()) AS DATE) AS DATETIME)), -- Tomorrow 10:00 AM
    60,
    'CONFIRMED',
    'ONLINE',
    'Follow-up session after 2 weeks of treatment',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'BANK_TRANSFER'
);
PRINT '✅ TOMORROW 10:00 AM - Different consultant';

-- Appointment 4: TOMORROW at 3:00 PM (same consultant as today)
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
    @client2_id,
    @consultant1_id, -- Same consultant as today's appointments
    DATEADD(hour, 15, CAST(CAST(DATEADD(day, 1, GETDATE()) AS DATE) AS DATETIME)), -- Tomorrow 3:00 PM
    60,
    'CONFIRMED',
    'ONLINE',
    'Regular therapy session - anxiety management',
    200000,
    'PAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ TOMORROW 03:00 PM - Same consultant';

-- ========================================
-- NEXT WEEK APPOINTMENTS
-- ========================================

-- Appointment 5: NEXT MONDAY at 11:00 AM
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
    @client1_id,
    @consultant1_id,
    DATEADD(hour, 11, CAST(CAST(DATEADD(day, 7, GETDATE()) AS DATE) AS DATETIME)), -- Next week Monday 11:00 AM
    60,
    'PENDING',
    'IN_PERSON',
    'Weekly check-in and progress evaluation',
    200000,
    'UNPAID',
    GETDATE(),
    GETDATE(),
    'VNPAY'
);
PRINT '✅ NEXT WEEK MONDAY 11:00 AM - PENDING';

-- Display all future appointments
PRINT '';
PRINT '========================================';
PRINT 'ALL FUTURE APPOINTMENTS CREATED:';
PRINT '========================================';

SELECT 
    a.id,
    a.client_id,
    a.consultant_id,
    CONVERT(varchar, a.appointment_date, 120) as appointment_time,
    DATENAME(weekday, a.appointment_date) as day_of_week,
    a.duration_minutes,
    a.status,
    a.appointment_type,
    a.fee,
    a.payment_status,
    LEFT(a.client_notes, 40) + '...' as notes_preview
FROM appointments a
WHERE a.appointment_date > GETDATE()
ORDER BY a.appointment_date;

-- Show TODAY's schedule for main consultant (ID 5)
PRINT '';
PRINT 'TODAY''S SCHEDULE - Consultant ID 5:';
SELECT 
    CONVERT(varchar, appointment_date, 108) as time_slot,
    status,
    appointment_type,
    'Client ' + CAST(client_id AS VARCHAR) as client
FROM appointments 
WHERE consultant_id = 5
    AND CONVERT(date, appointment_date) = CONVERT(date, GETDATE())
    AND status IN ('PENDING', 'CONFIRMED')
ORDER BY appointment_date;

PRINT '';
PRINT '========================================';
PRINT 'TESTING SCENARIOS:';
PRINT '========================================';
PRINT '';
PRINT 'FOR TODAY (Consultant ID 5):';
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
PRINT 'EXPECTED: 7 available slots shown in UI';
PRINT '';
PRINT 'TO TEST:';
PRINT '1. Login as client (ID 2 or 3)';
PRINT '2. Select consultant (ID 5)';
PRINT '3. Pick TODAY''s date';
PRINT '4. Should see 7 time slots (not 9)';
PRINT '5. Try booking 09:00 → FAIL (conflict)';
PRINT '6. Try booking 14:00 → FAIL (conflict)';
PRINT '7. Try booking 10:00 → SUCCESS';
PRINT '';
PRINT '🎯 Future appointments ready for testing!';

-- Quick verification query
PRINT '';
PRINT 'Quick check - Future appointments count:';
SELECT COUNT(*) as future_appointments_count FROM appointments WHERE appointment_date > GETDATE(); 