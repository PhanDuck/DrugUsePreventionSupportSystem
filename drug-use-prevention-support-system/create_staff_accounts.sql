-- Tạo tài khoản Staff cho hệ thống Drug Prevention Support
-- Mật khẩu mặc định: 123456 (đã được mã hóa BCrypt)

-- Đảm bảo role STAFF tồn tại (role_id = 5)
INSERT INTO roles (id, name) VALUES (5, 'STAFF') ON DUPLICATE KEY UPDATE name = 'STAFF';

-- Tài khoản Staff 1: Quản lý khóa học
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.course',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.course@drugprevention.com',
    'Nguyễn',
    'Văn Khóa',
    '0901234567',
    '123 Đường ABC, Quận 1, TP.HCM',
    'Nam',
    'Cử nhân Giáo dục',
    'Quản lý khóa học, Đào tạo',
    'Chuyên viên quản lý khóa học với 5 năm kinh nghiệm trong lĩnh vực giáo dục phòng chống ma túy.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 2: Quản lý nội dung
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.content',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.content@drugprevention.com',
    'Trần',
    'Thị Nội',
    '0901234568',
    '456 Đường XYZ, Quận 3, TP.HCM',
    'Nữ',
    'Cử nhân Truyền thông',
    'Quản lý nội dung, Biên tập',
    'Chuyên viên quản lý nội dung với 3 năm kinh nghiệm trong lĩnh vực truyền thông giáo dục.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 3: Hỗ trợ kỹ thuật
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.tech',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.tech@drugprevention.com',
    'Lê',
    'Văn Kỹ',
    '0901234569',
    '789 Đường DEF, Quận 7, TP.HCM',
    'Nam',
    'Cử nhân Công nghệ thông tin',
    'Hỗ trợ kỹ thuật, Quản trị hệ thống',
    'Chuyên viên hỗ trợ kỹ thuật với 4 năm kinh nghiệm trong lĩnh vực CNTT và quản trị hệ thống.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 4: Quản lý học viên
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.student',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.student@drugprevention.com',
    'Phạm',
    'Thị Học',
    '0901234570',
    '321 Đường GHI, Quận 5, TP.HCM',
    'Nữ',
    'Cử nhân Tâm lý học',
    'Quản lý học viên, Tư vấn',
    'Chuyên viên quản lý học viên với 6 năm kinh nghiệm trong lĩnh vực tâm lý học và tư vấn.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 5: Quản lý tài chính
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.finance',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.finance@drugprevention.com',
    'Hoàng',
    'Văn Tài',
    '0901234571',
    '654 Đường JKL, Quận 10, TP.HCM',
    'Nam',
    'Cử nhân Kế toán',
    'Quản lý tài chính, Kế toán',
    'Chuyên viên quản lý tài chính với 7 năm kinh nghiệm trong lĩnh vực kế toán và tài chính.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 6: Quản lý đánh giá
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.assessment',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.assessment@drugprevention.com',
    'Vũ',
    'Thị Đánh',
    '0901234572',
    '987 Đường MNO, Quận 11, TP.HCM',
    'Nữ',
    'Cử nhân Y tế công cộng',
    'Quản lý đánh giá, Sức khỏe cộng đồng',
    'Chuyên viên quản lý đánh giá với 5 năm kinh nghiệm trong lĩnh vực y tế công cộng.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 7: Quản lý blog
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.blog',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.blog@drugprevention.com',
    'Đặng',
    'Văn Blog',
    '0901234573',
    '147 Đường PQR, Quận 2, TP.HCM',
    'Nam',
    'Cử nhân Báo chí',
    'Quản lý blog, Viết bài',
    'Chuyên viên quản lý blog với 4 năm kinh nghiệm trong lĩnh vực báo chí và truyền thông.',
    true,
    5,
    NOW(),
    NOW()
);

-- Tài khoản Staff 8: Quản lý lịch hẹn
INSERT INTO users (
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    gender, 
    degree, 
    expertise, 
    bio, 
    is_active, 
    role_id, 
    created_at, 
    updated_at
) VALUES (
    'staff.appointment',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 123456
    'staff.appointment@drugprevention.com',
    'Ngô',
    'Thị Lịch',
    '0901234574',
    '258 Đường STU, Quận 4, TP.HCM',
    'Nữ',
    'Cử nhân Quản trị kinh doanh',
    'Quản lý lịch hẹn, Tổ chức sự kiện',
    'Chuyên viên quản lý lịch hẹn với 3 năm kinh nghiệm trong lĩnh vực quản trị và tổ chức sự kiện.',
    true,
    5,
    NOW(),
    NOW()
);

-- Hiển thị thông tin tài khoản đã tạo
SELECT 
    u.id,
    u.username,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.phone,
    u.expertise,
    r.name as role
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'STAFF'
ORDER BY u.id; 