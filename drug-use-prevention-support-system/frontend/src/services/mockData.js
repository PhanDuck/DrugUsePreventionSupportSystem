// Mock consultants data
export const mockConsultants = [
  {
    id: 1,
    firstName: 'Nguyễn',
    lastName: 'Văn Học',
    email: 'nguyen.vanhoc@drugprevention.vn',
    expertise: 'Tâm lý học',
    createdAt: '2020-01-15T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
  },
  {
    id: 2,
    firstName: 'Trần',
    lastName: 'Thị Phòng',
    email: 'tran.thiphong@drugprevention.vn',
    expertise: 'Nghiện chất',
    createdAt: '2019-03-20T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
  },
  {
    id: 3,
    firstName: 'Lê',
    lastName: 'Văn Trợ',
    email: 'le.vantro@drugprevention.vn',
    expertise: 'Tư vấn gia đình',
    createdAt: '2018-07-10T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
  },
  {
    id: 4,
    firstName: 'Phạm',
    lastName: 'Thị Lý',
    email: 'pham.thily@drugprevention.vn',
    expertise: 'Tâm lý học',
    createdAt: '2021-05-12T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
  },
  {
    id: 5,
    firstName: 'Hoàng',
    lastName: 'Minh Tuấn',
    email: 'hoang.minhtuan@drugprevention.vn',
    expertise: 'Nghiện chất',
    createdAt: '2017-11-08T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
  }
];

// Mock available slots data
export const mockAvailableSlots = {
  1: { // consultant id 1
    '2024-12-20': [
      { startTime: '08:00' },
      { startTime: '08:15' },
      { startTime: '09:00' },
      { startTime: '10:30' },
      { startTime: '14:00' },
      { startTime: '15:15' },
      { startTime: '16:30' }
    ],
    '2024-12-21': [
      { startTime: '08:30' },
      { startTime: '09:45' },
      { startTime: '11:00' },
      { startTime: '13:30' },
      { startTime: '15:00' },
      { startTime: '16:15' }
    ]
  },
  2: { // consultant id 2
    '2024-12-20': [
      { startTime: '08:45' },
      { startTime: '10:00' },
      { startTime: '11:15' },
      { startTime: '14:30' },
      { startTime: '15:45' }
    ],
    '2024-12-21': [
      { startTime: '08:00' },
      { startTime: '09:15' },
      { startTime: '10:30' },
      { startTime: '13:00' },
      { startTime: '14:15' },
      { startTime: '16:00' }
    ]
  },
  3: { // consultant id 3
    '2024-12-20': [
      { startTime: '09:00' },
      { startTime: '10:15' },
      { startTime: '11:30' },
      { startTime: '13:45' },
      { startTime: '15:00' },
      { startTime: '16:45' }
    ],
    '2024-12-21': [
      { startTime: '08:15' },
      { startTime: '09:30' },
      { startTime: '11:45' },
      { startTime: '13:15' },
      { startTime: '14:30' },
      { startTime: '15:45' }
    ]
  },
  4: { // consultant id 4
    '2024-12-20': [
      { startTime: '08:30' },
      { startTime: '09:45' },
      { startTime: '11:00' },
      { startTime: '14:15' },
      { startTime: '15:30' },
      { startTime: '17:00' }
    ],
    '2024-12-21': [
      { startTime: '08:45' },
      { startTime: '10:00' },
      { startTime: '11:15' },
      { startTime: '13:30' },
      { startTime: '14:45' },
      { startTime: '16:30' }
    ]
  },
  5: { // consultant id 5
    '2024-12-20': [
      { startTime: '09:15' },
      { startTime: '10:30' },
      { startTime: '11:45' },
      { startTime: '13:00' },
      { startTime: '14:45' },
      { startTime: '16:00' }
    ],
    '2024-12-21': [
      { startTime: '08:00' },
      { startTime: '09:15' },
      { startTime: '10:45' },
      { startTime: '13:45' },
      { startTime: '15:15' },
      { startTime: '16:45' }
    ]
  }
};

// Mock blogs data (existing)
export const mockBlogs = [
  {
    id: 1,
    title: 'Tác hại của ma túy đá',
    content: 'Nội dung chi tiết về tác hại của ma túy đá...',
    authorName: 'Dr. Nguyễn Văn Học',
    publishedAt: '2024-12-01T10:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    viewCount: 1250,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Dấu hiệu nhận biết người sử dụng ma túy',
    content: 'Hướng dẫn nhận biết các dấu hiệu...',
    authorName: 'Dr. Trần Thị Phòng',
    publishedAt: '2024-11-28T14:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
    viewCount: 980,
    isFeatured: false
  }
];
