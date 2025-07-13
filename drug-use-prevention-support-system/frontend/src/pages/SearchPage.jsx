import React, { useState, useEffect } from 'react';
import { Input, Card, List, Tag, Button, Space, Select, Empty, Typography, Avatar, Divider, Tabs } from 'antd';
import { SearchOutlined, FilterOutlined, BookOutlined, FileTextOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    courses: [],
    blogs: [],
    consultants: [],
    assessments: []
  });
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    duration: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch();
    } else {
      setResults({
        courses: [],
        blogs: [],
        consultants: [],
        assessments: []
      });
    }
  }, [searchTerm, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Mock search results - replace with actual API calls
      const mockResults = {
        courses: [
          {
            id: 1,
            title: 'Phòng chống tệ nạn xã hội',
            description: 'Khóa học cung cấp kiến thức về các loại tệ nạn xã hội và cách phòng chống',
            category: 'Phòng chống',
            difficulty: 'Cơ bản',
            duration: '4 tuần',
            instructor: 'Nguyễn Văn A',
            rating: 4.5,
            enrolledCount: 150
          },
          {
            id: 2,
            title: 'Kỹ năng tư vấn và hỗ trợ',
            description: 'Học cách tư vấn và hỗ trợ người gặp khó khăn với tệ nạn',
            category: 'Tư vấn',
            difficulty: 'Nâng cao',
            duration: '6 tuần',
            instructor: 'Trần Thị B',
            rating: 4.8,
            enrolledCount: 89
          }
        ],
        blogs: [
          {
            id: 1,
            title: 'Dấu hiệu nhận biết tệ nạn xã hội',
            excerpt: 'Bài viết cung cấp thông tin về các dấu hiệu cảnh báo sớm...',
            author: 'Nguyễn Văn C',
            publishDate: '2024-01-15',
            readCount: 1250,
            category: 'Nhận biết'
          },
          {
            id: 2,
            title: 'Cách hỗ trợ người thân gặp khó khăn',
            excerpt: 'Hướng dẫn cách tiếp cận và hỗ trợ người thân đang gặp vấn đề...',
            author: 'Lê Thị D',
            publishDate: '2024-01-12',
            readCount: 890,
            category: 'Hỗ trợ'
          }
        ],
        consultants: [
          {
            id: 1,
            name: 'Nguyễn Văn E',
            specialization: 'Tư vấn tâm lý',
            experience: '5 năm',
            rating: 4.7,
            availableSlots: 3,
            avatar: null
          },
          {
            id: 2,
            name: 'Trần Thị F',
            specialization: 'Tư vấn phòng chống ma túy',
            experience: '8 năm',
            rating: 4.9,
            availableSlots: 1,
            avatar: null
          }
        ],
        assessments: [
          {
            id: 1,
            title: 'Đánh giá nguy cơ CRAFFT',
            description: 'Công cụ đánh giá nguy cơ sử dụng chất gây nghiện cho thanh thiếu niên',
            duration: '10 phút',
            questions: 20,
            category: 'Nguy cơ'
          },
          {
            id: 2,
            title: 'Đánh giá mức độ nghiện ASSIST',
            description: 'Bảng câu hỏi đánh giá mức độ nghiện và cần can thiệp',
            duration: '15 phút',
            questions: 25,
            category: 'Nghiện'
          }
        ]
      };

      // Apply filters
      const filteredResults = applyFilters(mockResults);
      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = { ...data };

    if (filters.category !== 'all') {
      filtered.courses = filtered.courses.filter(course => 
        course.category.toLowerCase().includes(filters.category.toLowerCase())
      );
      filtered.blogs = filtered.blogs.filter(blog => 
        blog.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.difficulty !== 'all') {
      filtered.courses = filtered.courses.filter(course => 
        course.difficulty === filters.difficulty
      );
    }

    if (filters.duration !== 'all') {
      filtered.courses = filtered.courses.filter(course => {
        const courseWeeks = parseInt(course.duration);
        const filterWeeks = parseInt(filters.duration);
        return courseWeeks <= filterWeeks;
      });
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getTotalResults = () => {
    return results.courses.length + results.blogs.length + results.consultants.length + results.assessments.length;
  };

  const renderCourseItem = (course) => (
    <List.Item
      key={course.id}
      actions={[
        <Button type="primary" size="small" onClick={() => navigate(`/courses/${course.id}`)}>
          Xem chi tiết
        </Button>
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
        title={
          <Space>
            <Text strong>{course.title}</Text>
            <Tag color="blue">{course.category}</Tag>
            <Tag color="green">{course.difficulty}</Tag>
          </Space>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>{course.description}</div>
            <Space size="small">
              <Text type="secondary">Giảng viên: {course.instructor}</Text>
              <Text type="secondary">Thời gian: {course.duration}</Text>
              <Text type="secondary">⭐ {course.rating}</Text>
              <Text type="secondary">👥 {course.enrolledCount} học viên</Text>
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  const renderBlogItem = (blog) => (
    <List.Item
      key={blog.id}
      actions={[
        <Button type="link" size="small" onClick={() => navigate(`/blogs/${blog.id}`)}>
          Đọc bài viết
        </Button>
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#52c41a' }} />}
        title={
          <Space>
            <Text strong>{blog.title}</Text>
            <Tag color="green">{blog.category}</Tag>
          </Space>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>{blog.excerpt}</div>
            <Space size="small">
              <Text type="secondary">Tác giả: {blog.author}</Text>
              <Text type="secondary">📅 {blog.publishDate}</Text>
              <Text type="secondary">👁️ {blog.readCount} lượt đọc</Text>
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  const renderConsultantItem = (consultant) => (
    <List.Item
      key={consultant.id}
      actions={[
        <Button type="primary" size="small" onClick={() => navigate(`/appointments?consultant=${consultant.id}`)}>
          Đặt lịch
        </Button>
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#faad14' }} />}
        title={
          <Space>
            <Text strong>{consultant.name}</Text>
            <Tag color="orange">{consultant.specialization}</Tag>
          </Space>
        }
        description={
          <div>
            <Space size="small">
              <Text type="secondary">Kinh nghiệm: {consultant.experience}</Text>
              <Text type="secondary">⭐ {consultant.rating}</Text>
              <Text type="secondary">📅 {consultant.availableSlots} slot trống</Text>
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  const renderAssessmentItem = (assessment) => (
    <List.Item
      key={assessment.id}
      actions={[
        <Button type="primary" size="small" onClick={() => navigate(`/surveys/${assessment.id}`)}>
          Bắt đầu đánh giá
        </Button>
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#722ed1' }} />}
        title={
          <Space>
            <Text strong>{assessment.title}</Text>
            <Tag color="purple">{assessment.category}</Tag>
          </Space>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>{assessment.description}</div>
            <Space size="small">
              <Text type="secondary">⏱️ {assessment.duration}</Text>
              <Text type="secondary">❓ {assessment.questions} câu hỏi</Text>
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>🔍 Tìm Kiếm</Title>
          <Search
            placeholder="Tìm kiếm khóa học, bài viết, tư vấn viên..."
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            style={{ marginBottom: '16px' }}
          />
          
          <Space wrap>
            <Select
              placeholder="Danh mục"
              style={{ width: 150 }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="all">Tất cả danh mục</Option>
              <Option value="phòng chống">Phòng chống</Option>
              <Option value="tư vấn">Tư vấn</Option>
              <Option value="nhận biết">Nhận biết</Option>
              <Option value="hỗ trợ">Hỗ trợ</Option>
            </Select>
            
            <Select
              placeholder="Độ khó"
              style={{ width: 120 }}
              value={filters.difficulty}
              onChange={(value) => handleFilterChange('difficulty', value)}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Cơ bản">Cơ bản</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Nâng cao">Nâng cao</Option>
            </Select>
            
            <Select
              placeholder="Thời gian"
              style={{ width: 120 }}
              value={filters.duration}
              onChange={(value) => handleFilterChange('duration', value)}
            >
              <Option value="all">Tất cả</Option>
              <Option value="2">≤ 2 tuần</Option>
              <Option value="4">≤ 4 tuần</Option>
              <Option value="6">≤ 6 tuần</Option>
            </Select>
          </Space>
        </div>

        {searchTerm && (
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary">
              Tìm thấy {getTotalResults()} kết quả cho "{searchTerm}"
            </Text>
          </div>
        )}

        {searchTerm ? (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`Tất cả (${getTotalResults()})`} key="all">
              {getTotalResults() === 0 ? (
                <Empty description="Không tìm thấy kết quả nào" />
              ) : (
                <div>
                  {results.courses.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📚 Khóa học ({results.courses.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.courses}
                        renderItem={renderCourseItem}
                      />
                    </div>
                  )}
                  
                  {results.blogs.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📝 Bài viết ({results.blogs.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.blogs}
                        renderItem={renderBlogItem}
                      />
                    </div>
                  )}
                  
                  {results.consultants.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>👨‍⚕️ Tư vấn viên ({results.consultants.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.consultants}
                        renderItem={renderConsultantItem}
                      />
                    </div>
                  )}
                  
                  {results.assessments.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📋 Đánh giá ({results.assessments.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.assessments}
                        renderItem={renderAssessmentItem}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabPane>
            
            <TabPane tab={`Khóa học (${results.courses.length})`} key="courses">
              <List
                loading={loading}
                dataSource={results.courses}
                renderItem={renderCourseItem}
                locale={{ emptyText: <Empty description="Không tìm thấy khóa học nào" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Bài viết (${results.blogs.length})`} key="blogs">
              <List
                loading={loading}
                dataSource={results.blogs}
                renderItem={renderBlogItem}
                locale={{ emptyText: <Empty description="Không tìm thấy bài viết nào" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Tư vấn viên (${results.consultants.length})`} key="consultants">
              <List
                loading={loading}
                dataSource={results.consultants}
                renderItem={renderConsultantItem}
                locale={{ emptyText: <Empty description="Không tìm thấy tư vấn viên nào" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Đánh giá (${results.assessments.length})`} key="assessments">
              <List
                loading={loading}
                dataSource={results.assessments}
                renderItem={renderAssessmentItem}
                locale={{ emptyText: <Empty description="Không tìm thấy đánh giá nào" /> }}
              />
            </TabPane>
          </Tabs>
        ) : (
          <Empty 
            description="Nhập từ khóa để bắt đầu tìm kiếm"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default SearchPage; 