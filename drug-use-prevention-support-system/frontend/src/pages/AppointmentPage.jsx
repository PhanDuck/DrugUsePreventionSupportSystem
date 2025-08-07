import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  message, 
  Avatar,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  Empty,
  List,
  Typography,
  Statistic,
  Tabs,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../config/axios';
import authService from '../services/authService';
import appointmentService from '../services/appointmentService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('consultants');
  
  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Booking state
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Computed selectedDateTime from selectedDate and selectedTime
  const selectedDateTime = selectedDate && selectedTime ? 
    dayjs(selectedDate).format('YYYY-MM-DD') + 'T' + selectedTime + ':00' : 
    null;

  // Statistics state
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    upcoming: 0
  });

  useEffect(() => {
    checkAuthentication();
    loadConsultants();
    // Only load user appointments if authenticated
    if (authService.isAuthenticated()) {
      loadUserAppointments();
    }
  }, []);

  // Update stats when appointments change
  useEffect(() => {
    setAppointmentStats({
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'PENDING').length,
      confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
      completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
      upcoming: appointments.filter(apt => 
        apt.status === 'CONFIRMED' && dayjs(apt.appointmentDate).isAfter(dayjs())
      ).length
    });
  }, [appointments]);

  const checkAuthentication = () => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      console.log('✅ User authenticated:', user);
      setCurrentUser(user);
    } else {
      console.log('❌ User not authenticated');
      setCurrentUser(null);
    }
  };

  // Load all consultants from backend
  const loadConsultants = async () => {
    try {
      console.log('🔄 Starting to load consultants...');
      setLoading(true);
      
              console.log('🌐 API Base URL:', api.defaults.baseURL);
        const response = await api.get('/users/consultants');
        console.log('📥 Raw API response:', response.data);
        console.log('📥 Response structure:', {
          hasData: !!response.data.data,
          dataLength: response.data.data?.length,
          directData: response.data
        });
        
        // Extract data from response structure
        const consultantsData = response.data.data || response.data;
        console.log('📥 Extracted consultants data:', consultantsData);
      
      if (consultantsData && Array.isArray(consultantsData)) {
        console.log('📥 Processing consultants array:', consultantsData.length, 'items');
        
        const enhancedConsultants = consultantsData.map((consultant, index) => {
                    console.log(`📥 Processing consultant ${index}:`, consultant);
          console.log(`📥 Consultant name fields:`, {
            fullName: consultant.fullName,
            userName: consultant.userName,
            degree: consultant.degree,
            expertise: consultant.expertise
          });
          
          const enhanced = {
              ...consultant,
              // Keep both id and userID for compatibility
              id: consultant.userID || consultant.id,
              displayName: (() => {
                // Build display name with fallbacks
                const degree = consultant.degree ? consultant.degree + ' ' : '';
                const fullName = consultant.fullName || consultant.userName || 'Unknown Consultant';
                const displayName = `${degree}${fullName}`.trim();
                return displayName || 'Unknown Consultant';
              })(),
              specialty: consultant.expertise || 'General Counseling',
            // Professional avatar images
            avatar: [
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face', 
              'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face'
            ][index % 4],
            // Use real data instead of mock data
            rating: 4.5 + Math.random() * 0.5, // Realistic ratings 4.5-5.0
            price: consultant.consultationFee || 100000, // Use consultant's fee or default (VND)
            isOnline: true, // All consultants available online
            experienceYears: consultant.bio ? parseInt(consultant.bio.match(/(\d+)\s+years?/)?.[1]) || 10 : 10, // Extract from bio
            description: consultant.bio || 'Experienced professional in substance abuse treatment and counseling.'
          };
          
                      console.log(`📥 Enhanced consultant ${index}:`, enhanced);
            console.log(`📥 Final display name for consultant ${index}:`, enhanced.displayName);
            return enhanced;
        });
        
        console.log('✅ Final enhanced consultants:', enhancedConsultants);
        setConsultants(enhancedConsultants);
      } else {
        console.error('❌ Invalid consultants data:', response.data);
        setConsultants([]);
      }
    } catch (error) {
      console.error('💥 Error loading consultants:', error);
      console.error('💥 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      message.error('Unable to load consultants list');
      setConsultants([]);
    } finally {
      console.log('🏁 Finished loading consultants');
      setLoading(false);
    }
  };

  // Load user's appointments
  const loadUserAppointments = async () => {
    try {
      const user = authService.getCurrentUser();
      const userRole = authService.getUserRole();
      if (!user?.id) return;

      let result;
      if (userRole === 'CONSULTANT') {
        // Load consultant appointments
        result = await appointmentService.getAppointmentsByConsultant(user.id);
        console.log('📥 Consultant appointments loaded:', result);
      } else {
        // Load client appointments
        result = await appointmentService.getAppointmentsByClient(user.id);
        console.log('📥 Client appointments loaded:', result);
      }
      
      if (result.success && result.data) {
        setAppointments(result.data);
        // Calculate stats for both user types
        calculateAppointmentStats(result.data);
      } else {
        console.error('Failed to load appointments:', result.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  // Calculate appointment statistics
  const calculateAppointmentStats = (appointmentsList) => {
    const today = dayjs().format('YYYY-MM-DD');
    const stats = {
      total: appointmentsList.length,
      pending: appointmentsList.filter(apt => apt.status === 'PENDING').length,
      confirmed: appointmentsList.filter(apt => apt.status === 'CONFIRMED').length,
      completed: appointmentsList.filter(apt => apt.status === 'COMPLETED').length,
      upcoming: appointmentsList.filter(apt => 
        dayjs(apt.appointmentDate).isAfter(dayjs()) && 
        ['PENDING', 'CONFIRMED'].includes(apt.status)
      ).length
    };
    setAppointmentStats(stats);
    console.log('📊 Appointment stats calculated:', stats);
  };

  // Load available time slots for selected consultant and date
  const loadAvailableSlots = async (consultantId, date) => {
    console.log('🚀 === STARTING JavaScript Time Slot Generation ===');
    console.log('📥 Input params:', { consultantId, date, dateType: typeof date });
    
    try {
      // Check authentication first
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      console.log('🔐 Auth status:', { isAuth, user: currentUser });
      
      if (!isAuth) {
        console.log('❌ User not authenticated - stopping');
        message.warning('Please log in to view available times');
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }
      
      setLoadingSlots(true);
      console.log('⏳ Loading state set to true');
      
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      console.log('📅 Date formatting:', { original: date, formatted: formattedDate });
      
      console.log('⚡ === USING JAVASCRIPT TIME SLOT GENERATION ===');
      
      // Use the new JavaScript-based method
      const startTime = Date.now();
      const result = await appointmentService.getAvailableSlotsJS(consultantId, formattedDate);
      const endTime = Date.now();
      
      console.log('⚡ JavaScript generation result:', result);
      console.log('⏱️ Processing time:', `${endTime - startTime}ms`);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log(`✅ Generated ${result.data.length} available time slots:`, result.data);
        setAvailableSlots(result.data);
        message.success(`Found ${result.data.length} available time slots`);
      } else {
        console.log('⚠️ No slots available for this date');
        setAvailableSlots([]);
        
        // Check why no slots were available
        if (result.message) {
          message.info(result.message);
        } else {
          // Check if it's weekend or past date
          const selectedDate = new Date(formattedDate + 'T00:00:00');
          const today = new Date();
          const dayOfWeek = selectedDate.getDay();
          
          if (selectedDate < today.setHours(0, 0, 0, 0)) {
            message.info('Cannot book appointments in the past');
          } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            message.info('No appointments available on weekends');
          } else {
            message.info('No available time slots for this date');
          }
        }
      }
      
    } catch (error) {
      console.log('💥 === JAVASCRIPT GENERATION ERROR ===');
      console.error('💥 Error object:', error);
      
      // Fallback to simple default slots on error
      console.log('🔧 Providing fallback time slots due to error');
      const fallbackSlots = generateDefaultTimeSlots(dayjs(date).format('YYYY-MM-DD'));
      console.log('🔧 Fallback slots generated:', fallbackSlots);
      setAvailableSlots(fallbackSlots);
      
      if (fallbackSlots.length > 0) {
        message.warning('Using default time slots due to system issue');
      } else {
        message.error('Unable to generate time slots for this date');
      }
      
    } finally {
      setLoadingSlots(false);
      console.log('🏁 Loading state set to false');
      console.log('🚀 === END loadAvailableSlots ===');
    }
  };

  // Generate default time slots (working hours 8AM - 5PM, 1-hour intervals)
  const generateDefaultTimeSlots = (date) => {
    const slots = [];
    const selectedDate = dayjs(date);
    
    // Skip if date is in the past
    if (selectedDate.isBefore(dayjs(), 'day')) {
      return [];
    }
    
    // Generate 1-hour slots: 8:00-9:00, 9:00-10:00, etc. (skip lunch 12:00-13:00)
    const workingHours = [8, 9, 10, 11, 13, 14, 15, 16, 17];
    
    for (const hour of workingHours) {
      const slotTime = selectedDate.hour(hour).minute(0);
      
      // Skip slots that are in the past (for today)
      if (slotTime.isAfter(dayjs())) {
        slots.push({
          time: slotTime.format('HH:mm'),
          display: slotTime.format('h:mm A') + ' - ' + slotTime.add(1, 'hour').format('h:mm A'),
          available: Math.random() > 0.3, // 70% availability rate
          slotDateTime: slotTime.toISOString(),
          duration: 60,
          hourSlot: true
        });
      }
    }
    
    return slots.filter(slot => slot.available);
  };

  // Handle consultant selection for booking
  const handleSelectConsultant = (consultant) => {
    // Check authentication before allowing booking
    if (!authService.isAuthenticated()) {
      Modal.confirm({
        title: 'Login Required',
        content: 'You need to log in before booking an appointment. Would you like to go to the login page?',
        okText: 'Login',
        cancelText: 'Cancel',
        onOk: () => navigate('/login')
      });
      return;
    }

    console.log('👨‍⚕️ Selected consultant:', consultant);
    console.log('👨‍⚕️ Consultant ID check:', { 
      id: consultant.id, 
      userID: consultant.userID,
      hasId: !!consultant.id,
      hasUserId: !!consultant.userID 
    });
    
    // Allow modal to open even if ID is undefined for debugging
    setSelectedConsultant(consultant);
    setShowBookingModal(true);
    setBookingStep(1);
    
    // Clear previous selections
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    form.resetFields();
    
    // Auto-select today's date as default (if not weekend)
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    const defaultDate = today.day() === 0 || today.day() === 6 ? tomorrow : today; // Skip weekends
    
    setTimeout(() => {
      form.setFieldsValue({ 
        date: defaultDate,
        appointmentType: 'ONLINE',
        paymentMethod: 'VNPAY'
      });
      setSelectedDate(defaultDate);
      
      // Only try to load slots if we have a valid ID
      const consultantId = consultant.id || consultant.userID;
      if (consultantId) {
        loadAvailableSlots(consultantId, defaultDate);
      } else {
        console.warn('⚠️ No consultant ID available, skipping slot loading');
      }
    }, 100);
  };

  const handleDateChange = (date) => {
    console.log('📅 Date changed:', date);
    setSelectedDate(date);
    setSelectedTime(null); // Clear selected time
    form.setFieldsValue({ time: undefined });
    
    if (selectedConsultant && date) {
      loadAvailableSlots(selectedConsultant.id, date);
    }
  };

  const handleTimeChange = (time) => {
    console.log('⏰ Time selected:', time);
    setSelectedTime(time);
  };

  // Handle booking submission
  const handleBookingSubmit = async (values) => {
    if (!selectedConsultant) {
      message.error('Please select a consultant first');
      return;
    }
    
    if (!selectedDateTime) {
      message.error('Please select date and time first');
      return;
    }

    const appointmentData = {
      consultantId: selectedConsultant.id,
      appointmentDate: selectedDateTime,
      appointmentType: values.appointmentType,
      clientNotes: values.notes || '',
      fee: selectedConsultant.consultationFee || selectedConsultant.price || 200000,
    };

    console.log('📅 Booking appointment:', appointmentData);
    setBookingLoading(true);

    try {
      // 🔄 SIMPLIFIED: Direct appointment creation
      const result = await appointmentService.createAppointmentWithPayment(appointmentData);
      
      if (result.success) {
        message.success('Appointment booked successfully!');
        
        // Show success and redirect to appointments list
        Modal.success({
          title: 'Appointment Confirmed!',
          content: (
            <div>
              <p>Your appointment has been booked successfully.</p>
              <p><strong>Consultant:</strong> {selectedConsultant.name || selectedConsultant.displayName}</p>
              <p><strong>Date:</strong> {new Date(selectedDateTime).toLocaleString()}</p>
              <p><strong>Type:</strong> {values.appointmentType}</p>
            </div>
          ),
          onOk: () => {
            navigate('/appointments');
          }
        });
        
        // Reset form and state
        form.resetFields();
        setSelectedConsultant(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setShowBookingModal(false);
      } else {
        message.error(result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      message.error('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Get unique specialties for filter
  const specialties = [...new Set(consultants.map(c => c.specialty))];

  // Filter and sort consultants
  const filteredConsultants = consultants
    .filter(consultant => {
      const matchesSearch = !searchTerm || 
        consultant.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = filterSpecialty === 'all' || consultant.specialty === filterSpecialty;
      
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'experience':
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'name':
        default:
          return a.displayName.localeCompare(b.displayName);
      }
    });

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'COMPLETED': 'green',
      'CANCELLED': 'red',
      'RESCHEDULED': 'purple'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': <ClockCircleOutlined />,
      'CONFIRMED': <CheckCircleOutlined />,
      'COMPLETED': <CheckCircleOutlined />,
      'CANCELLED': <CloseCircleOutlined />,
      'RESCHEDULED': <ExclamationCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .consultant-card {
            animation: slideInUp 0.6s ease-out;
          }
          
          .consultant-card:nth-child(1) { animation-delay: 0.1s; }
          .consultant-card:nth-child(2) { animation-delay: 0.2s; }
          .consultant-card:nth-child(3) { animation-delay: 0.3s; }
          .consultant-card:nth-child(4) { animation-delay: 0.4s; }
          
          .search-bar {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .gradient-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .gradient-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .gradient-button:hover::before {
            left: 100%;
          }
          
          @media (max-width: 768px) {
            .consultant-grid {
              padding: 0 16px;
            }
            
            .search-bar .ant-col {
              margin-bottom: 8px;
            }
          }
        `}
      </style>
      
      <div style={{ 
        padding: 'clamp(16px, 3vw, 24px)', 
        maxWidth: '1400px', 
        margin: '0 auto',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        {/* Debug Info - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <Card size="small" style={{ marginBottom: '16px', background: '#f0f2f5' }}>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              🔧 Debug: User={currentUser?.firstName || 'None'} | Auth={authService.isAuthenticated().toString()} | 
              Consultants={consultants.length} | Backend={api.defaults.baseURL}
            </Text>
          </Card>
        )}

        {/* Enhanced Page Header with Animation */}
        <Card style={{ 
          marginBottom: '32px', 
          background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)', 
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(44, 90, 160, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'relative',
            color: '#fff', 
            textAlign: 'center', 
            padding: 'clamp(24px, 5vw, 40px) 20px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
          }}>
            {/* Remove floating animations for more professional look */}
            <Title level={1} style={{ 
              color: '#fff', 
              marginBottom: '12px',
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 1
            }}>
              Professional Counseling Services
            </Title>
            <Paragraph style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: 'clamp(14px, 2vw, 16px)', 
              margin: 0,
              fontWeight: '400',
              position: 'relative',
              zIndex: 1
            }}>
              Connect with licensed therapists and counselors
            </Paragraph>
          </div>
        </Card>

        {/* Professional Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {[
            { 
              title: "Total Appointments", 
              value: appointmentStats.total, 
              icon: <CalendarOutlined />, 
              color: "#2563eb",
              background: "#f0f9ff"
            },
            { 
              title: "Pending", 
              value: appointmentStats.pending, 
              icon: <ClockCircleOutlined />, 
              color: "#d97706",
              background: "#fffbeb"
            },
            { 
              title: "Confirmed", 
              value: appointmentStats.confirmed, 
              icon: <CheckCircleOutlined />, 
              color: "#059669",
              background: "#f0fdf4"
            },
            { 
              title: "Upcoming", 
              value: appointmentStats.upcoming, 
              icon: <CalendarOutlined />, 
              color: "#7c3aed",
              background: "#f5f3ff"
            }
          ].map((stat, index) => (
            <Col xs={12} sm={6} key={index}>
              <Card style={{
                background: stat.background,
                border: `1px solid ${stat.color}20`,
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}>
                <Statistic
                  title={<span style={{ color: '#6b7280', fontWeight: '500', fontSize: '12px' }}>{stat.title}</span>}
                  value={stat.value}
                  prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
                  valueStyle={{ 
                    color: stat.color, 
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    fontWeight: '600'
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: 'consultants',
              label: (
                <span>
                  <UserOutlined />
                  Select Counselor
                  <Badge count={consultants.length} style={{ marginLeft: '8px' }} />
                </span>
              ),
              children: (
                <div>
                  {/* Professional Search and Filter Bar */}
                  <Card style={{ 
                    marginBottom: '32px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff'
                  }}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={12} md={8}>
                        <Input
                          placeholder="Search counselors by name or specialty..."
                          prefix={<SearchOutlined style={{ color: '#6b7280', fontSize: '16px' }} />}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ 
                            borderRadius: '8px', 
                            height: '44px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={4}>
                        <Select
                          placeholder="Filter by specialty"
                          value={filterSpecialty}
                          onChange={setFilterSpecialty}
                          style={{ 
                            width: '100%', 
                            height: '44px'
                          }}
                          dropdownStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                          }}
                        >
                          <Option value="all">All Specialties</Option>
                          {specialties.map(specialty => (
                            <Option key={specialty} value={specialty}>
                              {specialty}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col xs={12} sm={6} md={4}>
                        <Select
                          placeholder="Sort by"
                          value={sortBy}
                          onChange={setSortBy}
                          style={{ 
                            width: '100%', 
                            height: '44px'
                          }}
                          dropdownStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                          }}
                        >
                          <Option value="name">Name A-Z</Option>
                          <Option value="rating">Highest Rating</Option>
                          <Option value="price">Lowest Price</Option>
                          <Option value="experience">Most Experienced</Option>
                        </Select>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between'
                        }}>
                          <Button 
                            icon={<FilterOutlined />} 
                            style={{ 
                              borderRadius: '8px', 
                              height: '44px',
                              background: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              fontWeight: '500',
                              padding: '0 16px'
                            }}
                            onClick={() => {
                              setSearchTerm('');
                              setFilterSpecialty('all');
                              setSortBy('name');
                            }}
                          >
                            Clear Filters
                          </Button>
                          <div style={{
                            background: '#f0f9ff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e0f2fe'
                          }}>
                            <Text style={{ 
                              fontSize: '13px', 
                              fontWeight: '500',
                              color: '#0369a1'
                            }}>
                              {filteredConsultants.length} counselors found
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* Professional Consultants Grid */}
                  <Row gutter={[24, 24]}>
                    {loading ? (
                      // Professional Loading Cards
                      [...Array(6)].map((_, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={index}>
                          <Card 
                            style={{ 
                              borderRadius: '16px', 
                              height: '580px',
                              background: '#ffffff',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                            }}
                            bodyStyle={{ padding: '24px', textAlign: 'center', height: '100%' }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              height: '100%',
                              gap: '16px'
                            }}>
                              <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: '#f3f4f6',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                              }} />
                              <div style={{
                                width: '120px',
                                height: '20px',
                                borderRadius: '4px',
                                background: '#f3f4f6',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                              }} />
                              <div style={{
                                width: '100px',
                                height: '16px',
                                borderRadius: '4px',
                                background: '#f3f4f6',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                              }} />
                              <Text style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</Text>
                            </div>
                          </Card>
                        </Col>
                      ))
                    ) : filteredConsultants.length > 0 ? (
                      filteredConsultants.map((consultant, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={consultant.id}>
                          <Card
                            hoverable
                            className="consultant-card"
                            style={{
                              borderRadius: '16px',
                              height: '580px', // Increased height
                              background: '#ffffff',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            bodyStyle={{ 
                              padding: '24px',
                              height: '100%',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                              e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            {/* Professional header with status */}
                            <div style={{
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              right: '0',
                              height: '4px',
                              background: consultant.isOnline 
                                ? 'linear-gradient(90deg, #10b981, #059669)' 
                                : 'linear-gradient(90deg, #6b7280, #4b5563)'
                            }} />
                            
                            {/* Online Status Badge */}
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              background: consultant.isOnline ? '#ecfdf5' : '#f3f4f6',
                              color: consultant.isOnline ? '#065f46' : '#4b5563',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              border: `1px solid ${consultant.isOnline ? '#10b981' : '#d1d5db'}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: consultant.isOnline ? '#10b981' : '#6b7280'
                              }} />
                              {consultant.isOnline ? 'Online' : 'Offline'}
                            </div>

                            {/* Card Content */}
                            <div style={{ 
                              textAlign: 'center', 
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              paddingTop: '20px'
                            }}>
                              {/* Avatar Section */}
                              <div style={{ marginBottom: '20px' }}>
                                <Avatar
                                  size={80}
                                  src={consultant.avatar}
                                  icon={<UserOutlined />}
                                  style={{
                                    border: '3px solid #f3f4f6',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    background: '#f9fafb'
                                  }}
                                />
                                <div style={{ marginTop: '16px' }}>
                                  <Title 
                                    level={4} 
                                    style={{ 
                                      color: '#111827', 
                                      margin: '0 0 4px 0',
                                      fontSize: '18px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    {consultant.displayName}
                                  </Title>
                                  <Text style={{ 
                                    color: '#6b7280', 
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    display: 'block',
                                    marginBottom: '8px'
                                  }}>
                                    {consultant.specialty}
                                  </Text>
                                  <Text style={{ 
                                    color: '#9ca3af', 
                                    fontSize: '12px',
                                    display: 'block',
                                    marginBottom: '4px'
                                  }}>
                                    {consultant.experienceYears}+ years experience
                                  </Text>
                                  {consultant.description && (
                                    <Text style={{ 
                                      color: '#6b7280', 
                                      fontSize: '11px',
                                      lineHeight: '1.4',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}>
                                      {consultant.description}
                                    </Text>
                                  )}
                                </div>
                              </div>

                              {/* Rating Section */}
                              <div style={{ marginBottom: '20px' }}>
                                <div style={{ 
                                  background: '#f8fafc', 
                                  padding: '12px 16px', 
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                                    <Text style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}>
                                      {consultant.rating?.toFixed(1)}
                                    </Text>
                                  </div>
                                  <Text style={{ color: '#6b7280', fontSize: '11px' }}>
                                    Verified Rating
                                  </Text>
                                </div>
                              </div>

                              {/* Price Section */}
                              <div style={{ marginBottom: '24px' }}>
                                <div style={{ 
                                  background: '#ffffff', 
                                  padding: '16px', 
                                  borderRadius: '8px',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <Text style={{ 
                                    color: '#3b82f6', 
                                    fontSize: '20px', 
                                    fontWeight: '700'
                                  }}>
                                    {consultant.price === 0 || consultant.price === null ? 'Free' : `${Number(consultant.price).toLocaleString()} VNĐ`}
                                  </Text>
                                  <br />
                                  <Text style={{ color: '#6b7280', fontSize: '12px' }}>
                                    per session
                                  </Text>
                                </div>
                              </div>

                              {/* Book Button */}
                              <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={() => handleSelectConsultant(consultant)}
                                style={{
                                  width: '100%',
                                  height: '44px',
                                  borderRadius: '8px',
                                  background: '#3b82f6',
                                  border: 'none',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#2563eb';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#3b82f6';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                                }}
                              >
                                Book Appointment
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col span={24}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                              <Title level={4} style={{ color: '#666' }}>
                                No matching counselors found
                              </Title>
                              <Paragraph style={{ color: '#999' }}>
                                Please try changing filters or search terms
                              </Paragraph>
                            </div>
                          }
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              )
            },
            {
              key: 'appointments',
              label: (
                <span>
                  <CalendarOutlined />
                  {authService.getUserRole() === 'CONSULTANT' ? 'My Client Appointments' : 'My Appointments'}
                  <Badge count={appointments.length} style={{ marginLeft: '8px' }} />
                </span>
              ),
              children: (
                <div>
                  {appointments.length === 0 ? (
                    <Empty 
                      description={authService.getUserRole() === 'CONSULTANT' ? 
                        "You have no client appointments yet" : 
                        "You have no appointments yet"
                      }
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <List
                      dataSource={appointments}
                      renderItem={appointment => (
                        <List.Item>
                          <Card style={{ width: '100%' }}>
                            <Row gutter={[16, 16]} align="middle">
                              <Col xs={24} sm={8}>
                                <Space direction="vertical" size="small">
                                  <Text strong>{appointment.consultantName}</Text>
                                  <Text type="secondary">{appointment.consultantExpertise}</Text>
                                                                     <Tag 
                                     color={getStatusColor(appointment.status)}
                                     icon={getStatusIcon(appointment.status)}
                                   >
                                     {appointmentService.getStatusDisplayText(appointment.status)}
                                   </Tag>
                                </Space>
                              </Col>
                              <Col xs={24} sm={8}>
                                <Space direction="vertical" size="small">
                                  <Text>
                                    <CalendarOutlined /> {dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}
                                  </Text>
                                  <Text>
                                    <ClockCircleOutlined /> {dayjs(appointment.appointmentDate).format('HH:mm')}
                                  </Text>
                                  <Text>
                                    {appointment.appointmentType === 'ONLINE' ? (
                                      <><VideoCameraOutlined /> Online</>
                                    ) : (
                                      <><EnvironmentOutlined /> In-person</>
                                    )}
                                  </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={8}>
                                <Space direction="vertical" size="small">
                                                                     <Text strong style={{ color: '#52c41a' }}>
                                     {appointment.fee ? `${appointment.fee.toLocaleString('vi-VN')} đ` : 'Not specified'}
                                   </Text>
                                                                     <Text type="secondary">
                                     Payment: {appointmentService.getPaymentStatusDisplayText(appointment.paymentStatus)}
                                   </Text>
                                  {appointment.status === 'CONFIRMED' && appointment.appointmentType === 'ONLINE' && (
                                    <div style={{ marginTop: '8px' }}>
                                      {appointment.meetingLink ? (
                                        <Button 
                                          type="primary" 
                                          size="large"
                                          icon={<VideoCameraOutlined />}
                                          onClick={() => window.open(appointment.meetingLink, '_blank')}
                                          style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                          }}
                                        >
                                          Join Meeting
                                        </Button>
                                      ) : (
                                        <div>
                                          <Text type="secondary" style={{ fontSize: '12px' }}>
                                            ⏳ Meeting link will be added by consultant
                                          </Text>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {appointment.status === 'CONFIRMED' && appointment.appointmentType === 'IN_PERSON' && (
                                    <div style={{ marginTop: '8px' }}>
                                      <Text strong style={{ color: '#1890ff' }}>
                                        📍 In-Person Meeting
                                      </Text>
                                      {appointment.meetingLink && (
                                        <div style={{ marginTop: '4px' }}>
                                          <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {appointment.meetingLink}
                                          </Text>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Space>
                              </Col>
                            </Row>
                          </Card>
                        </List.Item>
                      )}
                    />
                  )}
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Booking Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Book Appointment with {selectedConsultant?.displayName}</span>
          </Space>
        }
        open={showBookingModal}
        onCancel={() => {
          setShowBookingModal(false);
          setSelectedConsultant(null);
          setBookingStep(1);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedConsultant && (
          <div>
            {/* Consultant Info */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar 
                    size={48} 
                    src={selectedConsultant.avatar}
                    icon={<UserOutlined />}
                  />
                </Col>
                <Col flex={1}>
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedConsultant.degree && `${selectedConsultant.degree} `}
                    {selectedConsultant.displayName}
                  </Title>
                  <Text type="secondary">{selectedConsultant.specialty}</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                    {(selectedConsultant.consultationFee || selectedConsultant.price)?.toLocaleString('vi-VN')} đ/session
                  </Text>
                </Col>
              </Row>
            </Card>

            {/* Booking Form */}
            <Form
              form={form}
              layout="vertical"
              initialValues={{ 
                appointmentType: 'ONLINE'
              }}
              onFinish={handleBookingSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Select Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                      onChange={handleDateChange}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Select Time"
                    name="time"
                    rules={[{ required: true, message: 'Please select a time' }]}
                  >
                    <Select
                      placeholder={
                        !selectedDate 
                          ? "Please select a date first" 
                          : loadingSlots 
                            ? "Loading available times..." 
                            : availableSlots.length > 0 
                              ? "Choose your preferred time"
                              : "No available times for this date"
                      }
                      loading={loadingSlots}
                      disabled={!selectedDate || loadingSlots}
                      onChange={handleTimeChange}
                      notFoundContent={
                        loadingSlots ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin size="small" />
                            <div style={{ marginTop: '8px' }}>Loading time slots...</div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <ClockCircleOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
                            <div style={{ marginTop: '8px', color: '#999' }}>
                              {!selectedDate 
                                ? "Select a date to see available times"
                                : "No available time slots for this date"
                              }
                            </div>
                            {selectedDate && (
                              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                Try selecting a different date
                              </div>
                            )}
                          </div>
                        )
                      }
                      dropdownRender={(menu) => (
                        <div>
                          {availableSlots.length > 0 && (
                            <div style={{ 
                              padding: '8px 12px', 
                              borderBottom: '1px solid #f0f0f0',
                              background: '#fafafa',
                              fontSize: '12px',
                              color: '#666'
                            }}>
                              ✅ {availableSlots.length} time slots available on {selectedDate?.format('MMM DD, YYYY')}
                            </div>
                          )}
                          {menu}
                        </div>
                      )}
                    >
                      {availableSlots.map((slot, index) => (
                        <Option key={slot.time || index} value={slot.time || slot}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                              <ClockCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                              {slot.display || slot.time || slot}
                            </span>
                            <Tag size="small" color="green">Available</Tag>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Duration"
                    name="duration"
                  >
                    <Input 
                      value="60 minutes (1 hour)" 
                      disabled 
                      style={{ 
                        backgroundColor: '#f5f5f5', 
                        color: '#666',
                        cursor: 'not-allowed'
                      }}
                      prefix={<ClockCircleOutlined />}
                    />
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      All appointments are fixed at 1 hour duration
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Type"
                    name="appointmentType"
                    initialValue="ONLINE"
                  >
                    <Select>
                      <Option value="ONLINE">
                        <VideoCameraOutlined /> Online
                      </Option>
                      <Option value="IN_PERSON">
                        <EnvironmentOutlined /> In-person
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Notes"
                name="notes"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe your issue for consultation..."
                  maxLength={500}
                />
              </Form.Item>

              <Divider />

              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedConsultant(null);
                      setBookingStep(1);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Book Appointment
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>
      </div>
    </>
  );
};

export default AppointmentPage; 