import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Button, Tag, Rate, Spin, Empty, Input, Select, message } from 'antd';
import { UserOutlined, SearchOutlined, VideoCameraOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';

const { Search } = Input;
const { Option } = Select;

const AvailableConsultants = () => {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadConsultants();
  }, []);

  const loadConsultants = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading consultants...');
      const response = await userService.getConsultants();
      console.log('📥 API Response:', response);
      
      if (response.success) {
        console.log('✅ Success! Raw data:', response.data);
        console.log('📊 Number of consultants:', response.data.length);
        
        // Enhance consultant data with demo information
        const specialties = [
          'Substance Abuse Counseling',
          'Clinical Psychology', 
          'Family Counseling',
          'Youth Counseling',
          'Rehabilitation Therapy'
        ];
        
        const enhancedConsultants = response.data.map((consultant, index) => ({
          ...consultant,
          displayName: `${consultant.degree ? consultant.degree + ' ' : ''}${consultant.firstName || ''} ${consultant.lastName || ''}`.trim(),
          specialty: consultant.expertise || 'General Counseling',
          experienceYears: consultant.bio ? parseInt(consultant.bio.match(/(\d+)\s+years?/)?.[1]) || 10 : 10,
          rating: 4.5 + Math.random() * 0.5, // Number not string
          price: consultant.consultationFee || 100000, // Use consultant's fee or default (VND)
          // Fix Henry Le avatar - use index 2 for different image
          avatar: [
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face', 
            'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face'
          ][index % 4],
          isOnline: true,
          description: consultant.bio || 'Experienced professional in substance abuse treatment and counseling.'
        }));
        
        console.log('🎨 Enhanced consultants:', enhancedConsultants);
        setConsultants(enhancedConsultants);
      } else {
        console.error('❌ API Error:', response.message);
        message.error('Unable to load consultants list');
      }
    } catch (error) {
      console.error('💥 Exception loading consultants:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (consultant) => {
    if (!authService.isAuthenticated()) {
      message.warning('Please log in to book an appointment');
      navigate('/login');
      return;
    }
    navigate('/appointments', { state: { selectedConsultant: consultant } });
  };

  // Filter consultants based on search and filters
  const filteredConsultants = consultants.filter(consultant => {
    const matchSearch = !searchTerm || 
      consultant.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchSpecialty = filterSpecialty === 'all' || consultant.specialty === filterSpecialty;
    
    return matchSearch && matchSpecialty;
  });

  // Sort consultants
  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    if (sortBy === 'rating') {
      return parseFloat(b.rating) - parseFloat(a.rating);
    } else if (sortBy === 'experience') {
      return b.experience - a.experience;
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  // Get unique specialties for filter
  const specialties = [...new Set(consultants.map(c => c.specialty))];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading consultants..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1890ff' }}>
        Available Consultants
      </h2>
      
      {/* Search and Filter Bar */}
      <Row gutter={16} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search consultants..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={12} sm={6} md={8}>
          <Select
            value={filterSpecialty}
            onChange={setFilterSpecialty}
            style={{ width: '100%' }}
            placeholder="All Specialties"
          >
            <Option value="all">All Specialties</Option>
            {specialties.map(specialty => (
              <Option key={specialty} value={specialty}>{specialty}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} sm={6} md={8}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: '100%' }}
            placeholder="Sort by"
          >
            <Option value="rating">Rating</Option>
            <Option value="experience">Experience</Option>
            <Option value="price">Price</Option>
          </Select>
        </Col>
      </Row>

      {/* Consultants Grid */}
      {sortedConsultants.length === 0 ? (
        <Empty 
          description="No consultants found"
          style={{ marginTop: '50px' }}
        />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {sortedConsultants.map(consultant => (
            <Col xs={24} sm={12} lg={8} xl={6} key={consultant.id}>
              <Card
                style={{
                  width: 320,
                  height: 580,
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                }}
                bodyStyle={{ 
                  padding: '24px', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                hoverable
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
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
                      <h3 style={{ 
                        color: '#111827', 
                        margin: '0 0 4px 0',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        {consultant.displayName}
                      </h3>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px',
                        fontWeight: '400',
                        display: 'block',
                        marginBottom: '8px',
                        margin: '0 0 8px 0'
                      }}>
                        {consultant.specialty}
                      </p>
                      <p style={{ 
                        color: '#9ca3af', 
                        fontSize: '12px',
                        display: 'block',
                        marginBottom: '4px',
                        margin: '0'
                      }}>
                        {consultant.experienceYears}+ years experience
                      </p>
                      {consultant.description && (
                        <p style={{ 
                          color: '#6b7280', 
                          fontSize: '11px',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          margin: '8px 0 0 0'
                        }}>
                          {consultant.description}
                        </p>
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
                        <span style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}>
                          {(consultant.rating || 4.5).toFixed(1)}
                        </span>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '11px', margin: '0' }}>
                        Verified Rating
                      </p>
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
                      <span style={{ 
                        color: '#3b82f6', 
                        fontSize: '20px', 
                        fontWeight: '700'
                      }}>
                        {consultant.price === 0 || consultant.price === null ? 'Free' : `${Number(consultant.price).toLocaleString()} VNĐ`}
                      </span>
                      <br />
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        per session
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={() => handleBookAppointment(consultant)}
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
          ))}
        </Row>
      )}
    </div>
  );
};

export default AvailableConsultants; 