// Mock data cho tư vấn viên
export const consultants = [
  {
    id: 'tvv1',
    name: 'Nguyễn Văn A',
    email: 'a.consultant@gmail.com',
    meetLink: 'https://meet.google.com/abc-tvv1',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'tvv2',
    name: 'Trần Thị B',
    email: 'b.consultant@gmail.com',
    meetLink: 'https://meet.google.com/abc-tvv2',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'tvv3',
    name: 'Lê Văn C',
    email: 'c.consultant@gmail.com',
    meetLink: 'https://meet.google.com/abc-tvv3',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'tvv4',
    name: 'Phạm Thị D',
    email: 'd.consultant@gmail.com',
    meetLink: 'https://meet.google.com/abc-tvv4',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 'tvv5',
    name: 'Hoàng Văn E',
    email: 'e.consultant@gmail.com',
    meetLink: 'https://meet.google.com/abc-tvv5',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
];

// Mock slot trống của tư vấn viên
export const availableSlots = [
  // Ngày 2024-07-15
  {
    consultantId: 'tvv1',
    consultantName: 'Nguyễn Văn A',
    date: '2024-07-15',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  {
    consultantId: 'tvv2',
    consultantName: 'Trần Thị B',
    date: '2024-07-15',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  {
    consultantId: 'tvv3',
    consultantName: 'Lê Văn C',
    date: '2024-07-15',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  {
    consultantId: 'tvv4',
    consultantName: 'Phạm Thị D',
    date: '2024-07-15',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  {
    consultantId: 'tvv5',
    consultantName: 'Hoàng Văn E',
    date: '2024-07-15',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  // Ngày 2024-07-16
  {
    consultantId: 'tvv1',
    consultantName: 'Nguyễn Văn A',
    date: '2024-07-16',
    slots: [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '13:00', end: '15:00' },
      { start: '15:00', end: '17:00' }
    ]
  },
  // ... lặp lại cho các tư vấn viên khác và ngày 2024-07-16, 2024-07-17 nếu muốn
];

// Mock lịch hẹn đã đặt
export const appointments = [
  {
    id: 'appt1',
    consultantId: 'tvv1',
    consultantName: 'Nguyễn Văn A',
    customerName: 'Phạm Minh C',
    customerEmail: 'c.customer@gmail.com',
    customerPhone: '0901234567',
    description: 'Tư vấn cai nghiện',
    date: '2024-06-10',
    start: '08:00',
    end: '10:00',
    meetLink: 'https://meet.google.com/abc-tvv1',
    status: 'Đã thanh toán'
  },
  {
    id: 'appt2',
    consultantId: 'tvv2',
    consultantName: 'Trần Thị B',
    customerName: 'Ngô Văn D',
    customerEmail: 'd.customer@gmail.com',
    customerPhone: '0902345678',
    description: 'Tư vấn tâm lý',
    date: '2024-06-10',
    start: '10:00',
    end: '12:00',
    meetLink: 'https://meet.google.com/abc-tvv2',
    status: 'Đã thanh toán'
  },
  // ... thêm lịch hẹn khác
];

export const api = {
  getConsultants: () => Promise.resolve(consultants),
  getAvailableSlots: (serviceType, date) => {
    // Có thể lọc theo loại dịch vụ và ngày nếu cần
    return Promise.resolve(availableSlots);
  },
  bookAppointment: (appointmentData) => {
    // Giả lập đặt lịch thành công
    return Promise.resolve({ success: true, ...appointmentData, id: 'appt_new' });
  },
  getConsultantAppointments: (consultantId) => {
    return Promise.resolve(appointments.filter(a => a.consultantId === consultantId));
  },
  getAllAppointments: () => Promise.resolve(appointments),
}; 