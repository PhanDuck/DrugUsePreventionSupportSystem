import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Row, 
  Col, 
  Select, 
  Space, 
  List, 
  Tag, 
  Rate, 
  Avatar, 
  Typography, 
  Divider, 
  Skeleton,
  Empty,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  BookOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  FormOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import courseService from '../services/courseService';
import userService from '../services/userService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    type: 'all'
  });
  const [results, setResults] = useState({
    courses: [],
    consultants: [],
    blogs: [],
    assessments: []
  });
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    // Load initial data
    if (!searchTerm) {
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load courses
      const coursesResponse = await courseService.getCourses();
      const courses = coursesResponse.success ? coursesResponse.data : [];

      // Load consultants
      const consultantsResponse = await userService.getConsultants();
      const consultants = consultantsResponse.success ? consultantsResponse.data : [];

      setResults({
        courses: courses.slice(0, 5), // Show first 5
        consultants: consultants.slice(0, 5),
        blogs: [], // No blog API yet
        assessments: [] // No assessment API yet
      });

      setTotalResults(courses.length + consultants.length);
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      loadInitialData();
      return;
    }

    setLoading(true);
    try {
      const searchResults = {
        courses: [],
        consultants: [],
        blogs: [],
        assessments: []
      };

      // Search courses
      try {
        const coursesResponse = await courseService.getCourses();
        if (coursesResponse.success) {
          const allCourses = coursesResponse.data;
          searchResults.courses = allCourses.filter(course =>
            course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      } catch (error) {
        console.error('Error searching courses:', error);
      }

      // Search consultants
      try {
        const consultantsResponse = await api.get('/consultants/search', {
          params: { keyword: searchTerm }
        });
        searchResults.consultants = consultantsResponse.data || [];
      } catch (error) {
        console.error('Error searching consultants:', error);
        // Fallback to regular consultants list and filter
        try {
          const allConsultantsResponse = await userService.getConsultants();
          if (allConsultantsResponse.success) {
            searchResults.consultants = allConsultantsResponse.data.filter(consultant =>
              `${consultant.firstName} ${consultant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
              consultant.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              consultant.bio?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
        } catch (fallbackError) {
          console.error('Fallback consultant search failed:', fallbackError);
        }
      }

      // TODO: Add blog search when API is available
      // TODO: Add assessment search when API is available

      // Apply filters
      const filteredResults = applyFilters(searchResults);
      setResults(filteredResults);
      setTotalResults(
        filteredResults.courses.length + 
        filteredResults.consultants.length + 
        filteredResults.blogs.length + 
        filteredResults.assessments.length
      );

    } catch (error) {
      console.error('Search error:', error);
      message.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = { ...data };

    // Filter courses
    if (filters.category !== 'all') {
      filtered.courses = filtered.courses.filter(course => 
        course.categoryId === parseInt(filters.category)
      );
    }

    if (filters.difficulty !== 'all') {
      filtered.courses = filtered.courses.filter(course => 
        course.difficultyLevel === filters.difficulty
      );
    }

    // Filter by type
    if (filters.type !== 'all') {
      switch (filters.type) {
        case 'courses':
          filtered = { courses: filtered.courses, consultants: [], blogs: [], assessments: [] };
          break;
        case 'consultants':
          filtered = { courses: [], consultants: filtered.consultants, blogs: [], assessments: [] };
          break;
        case 'blogs':
          filtered = { courses: [], consultants: [], blogs: filtered.blogs, assessments: [] };
          break;
        case 'assessments':
          filtered = { courses: [], consultants: [], blogs: [], assessments: filtered.assessments };
          break;
      }
    }

    return filtered;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  useEffect(() => {
    if (searchTerm || Object.values(filters).some(f => f !== 'all')) {
      performSearch();
    }
  }, [filters]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const CourseCard = ({ course }) => (
    <Card 
      hoverable 
      style={{ marginBottom: '16px' }}
      actions={[
        <Link to={`/courses/${course.id}`} key="view">
          <Button type="primary" size="small">View Details</Button>
        </Link>
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
        title={course.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {course.description}
            </Paragraph>
            <Space>
              <Tag color="blue">{course.difficultyLevel || 'BEGINNER'}</Tag>
              {course.price > 0 ? (
                <Tag color="orange">{course.price === 0 || course.price === null ? 'Free' : `${Number(course.price).toLocaleString()} VNĐ`}</Tag>
              ) : (
                <Tag color="green">Free</Tag>
              )}
              <Text type="secondary">⏱️ {course.duration || 'Flexible duration'}</Text>
              {/* HIDDEN: Enrolled count - no longer showing participant info
              <Text type="secondary">👥 {course.currentParticipants || 0} enrolled</Text>
              */}
            </Space>
          </div>
        }
      />
    </Card>
  );

  const ConsultantCard = ({ consultant }) => (
    <Card 
      hoverable 
      style={{ marginBottom: '16px' }}
      actions={[
        <Link to={`/consultants/${consultant.id}`} key="book">
          <Button type="primary" size="small">Book Appointment</Button>
        </Link>
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />}
        title={`${consultant.firstName || ''} ${consultant.lastName || ''}`.trim()}
        description={
          <div>
            <Text strong>{consultant.expertise || 'General Counseling'}</Text>
            <br />
            <Text type="secondary">{consultant.bio || 'Experienced professional counselor'}</Text>
            <br />
            <Space style={{ marginTop: '8px' }}>
              <Rate disabled value={4.5} style={{ fontSize: '14px' }} />
              <Text type="secondary">4.5/5</Text>
            </Space>
          </div>
        }
      />
    </Card>
  );

  const BlogCard = ({ blog }) => (
    <Card 
      hoverable 
      style={{ marginBottom: '16px' }}
      actions={[
        <Button type="link" key="read">Read More</Button>
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#fa8c16' }} />}
        title={blog.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {blog.excerpt}
            </Paragraph>
            <Space>
              <Text type="secondary">By {blog.author}</Text>
              <Text type="secondary">{blog.publishDate}</Text>
              <Text type="secondary">{blog.readCount} reads</Text>
            </Space>
          </div>
        }
      />
    </Card>
  );

  const AssessmentCard = ({ assessment }) => (
    <Card 
      hoverable 
      style={{ marginBottom: '16px' }}
      actions={[
        <Link to="/survey" key="take">
          <Button type="primary" size="small">Take Assessment</Button>
        </Link>
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<FormOutlined />} style={{ backgroundColor: '#722ed1' }} />}
        title={assessment.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {assessment.description}
            </Paragraph>
            <Space>
              <Tag>{assessment.duration}</Tag>
              <Tag>{assessment.questions} questions</Tag>
              <Tag color="purple">{assessment.category}</Tag>
            </Space>
          </div>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>
        <SearchOutlined /> Search
      </Title>
      
      {/* Search Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Input.Search
              placeholder="Search courses, consultants, articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={performSearch}
              onKeyPress={handleKeyPress}
              size="large"
              enterButton="Search"
            />
          </Col>
          <Col xs={24} sm={8} md={4} lg={3}>
            <Select
              placeholder="Type"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">All Types</Option>
              <Option value="courses">Courses</Option>
              <Option value="consultants">Consultants</Option>
              <Option value="blogs">Articles</Option>
              <Option value="assessments">Assessments</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4} lg={3}>
            <Select
              placeholder="Category"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="1">Prevention</Option>
              <Option value="2">Treatment</Option>
              <Option value="3">Support</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4} lg={3}>
            <Select
              placeholder="Difficulty"
              value={filters.difficulty}
              onChange={(value) => handleFilterChange('difficulty', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">All Levels</Option>
              <Option value="BEGINNER">Beginner</Option>
              <Option value="INTERMEDIATE">Intermediate</Option>
              <Option value="ADVANCED">Advanced</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Search Results */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Text strong>
            {loading ? 'Searching...' : `Found ${totalResults} results`}
            {searchTerm && ` for "${searchTerm}"`}
          </Text>
        </div>

        <Divider />

        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <Card key={i} style={{ marginBottom: '16px' }}>
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : totalResults === 0 ? (
          <Empty description="No results found" />
        ) : (
          <div>
            {/* Courses Section */}
            {results.courses.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={4}>
                  <BookOutlined /> Courses ({results.courses.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {results.courses.map(course => (
                    <Col xs={24} sm={12} md={8} lg={8} key={course.id}>
                      <CourseCard course={course} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Consultants Section */}
            {results.consultants.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={4}>
                  <UserOutlined /> Consultants ({results.consultants.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {results.consultants.map(consultant => (
                    <Col xs={24} sm={12} md={8} lg={8} key={consultant.id}>
                      <ConsultantCard consultant={consultant} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Blogs Section */}
            {results.blogs.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={4}>
                  <FileTextOutlined /> Articles ({results.blogs.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {results.blogs.map(blog => (
                    <Col xs={24} sm={12} md={8} lg={8} key={blog.id}>
                      <BlogCard blog={blog} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Assessments Section */}
            {results.assessments.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={4}>
                  <FormOutlined /> Assessments ({results.assessments.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {results.assessments.map(assessment => (
                    <Col xs={24} sm={12} md={8} lg={8} key={assessment.id}>
                      <AssessmentCard assessment={assessment} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SearchPage; 