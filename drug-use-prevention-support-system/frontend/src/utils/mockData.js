// Mock user data for testing
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // In real app, this should be hashed
    role: 'admin',
    fullName: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: 'user123',
    role: 'user',
    fullName: 'Test User 1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    password: 'user123',
    role: 'user',
    fullName: 'Test User 2',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
  }
];

// Mock function to simulate API call
export const mockLogin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: `mock-jwt-token-${user.id}`,
  };
};

// Mock function to simulate registration
export const mockRegister = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if email already exists
  if (mockUsers.some(u => u.email === userData.email)) {
    throw new Error('Email đã được sử dụng');
  }

  // Check if username already exists
  if (mockUsers.some(u => u.username === userData.username)) {
    throw new Error('Tên đăng nhập đã được sử dụng');
  }

  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    role: 'user',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
  };

  // In a real app, we would add the user to the database
  // mockUsers.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token: `mock-jwt-token-${newUser.id}`,
  };
};

// Mock function to simulate password reset
export const mockResetPassword = async (email) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw new Error('Email không tồn tại trong hệ thống');
  }

  return {
    message: 'Mã xác nhận đã được gửi đến email của bạn',
    verificationCode: '123456', // In real app, this would be generated and sent via email
  };
};

// Mock function to verify reset code
export const mockVerifyResetCode = async (email, code) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (code !== '123456') {
    throw new Error('Mã xác nhận không đúng');
  }

  return {
    message: 'Mã xác nhận hợp lệ',
    resetToken: `mock-reset-token-${email}`,
  };
};

// Mock function to update password
export const mockUpdatePassword = async (resetToken, newPassword) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, we would update the password in the database
  return {
    message: 'Mật khẩu đã được cập nhật thành công',
  };
}; 