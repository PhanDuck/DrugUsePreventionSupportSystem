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
            title: 'Drug Prevention Education',
            description: 'Course providing knowledge about various drug-related issues and prevention methods',
            category: 'Prevention',
            difficulty: 'Basic',
            duration: '4 weeks',
            instructor: 'Nguyen Van A',
            rating: 4.5,
            enrolledCount: 150
          },
          {
            id: 2,
            title: 'Counseling and Support Skills',
            description: 'Learn how to counsel and support people who are struggling with drug-related issues',
            category: 'Counseling',
            difficulty: 'Advanced',
            duration: '6 weeks',
            instructor: 'Tran Thi B',
            rating: 4.8,
            enrolledCount: 89
          }
        ],
        blogs: [
          {
            id: 1,
            title: 'Recognizing Drug-Related Issues',
            excerpt: 'Article providing information about early warning signs...',
            author: 'Nguyen Van C',
            publishDate: '2024-01-15',
            readCount: 1250,
            category: 'Recognition'
          },
          {
            id: 2,
            title: 'How to Support Family Members in Difficulty',
            excerpt: 'Guidance on how to approach and support family members who are experiencing difficulties...',
            author: 'Le Thi D',
            publishDate: '2024-01-12',
            readCount: 890,
            category: 'Support'
          }
        ],
        consultants: [
          {
            id: 1,
            name: 'Nguyen Van E',
            specialization: 'Counseling Psychology',
            experience: '5 years',
            rating: 4.7,
            availableSlots: 3,
            avatar: null
          },
          {
            id: 2,
            name: 'Tran Thi F',
            specialization: 'Drug Prevention Counseling',
            experience: '8 years',
            rating: 4.9,
            availableSlots: 1,
            avatar: null
          }
        ],
        assessments: [
          {
            id: 1,
            title: 'CRAFFT Risk Assessment',
            description: 'Tool for assessing the risk of substance abuse among adolescents',
            duration: '10 minutes',
            questions: 20,
            category: 'Risk'
          },
          {
            id: 2,
            title: 'ASSIST Severity Assessment',
            description: 'Questionnaire for assessing substance abuse severity and intervention needs',
            duration: '15 minutes',
            questions: 25,
            category: 'Addiction'
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
          View details
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
              <Text type="secondary">Instructor: {course.instructor}</Text>
              <Text type="secondary">Duration: {course.duration}</Text>
              <Text type="secondary">⭐ {course.rating}</Text>
              <Text type="secondary">👥 {course.enrolledCount} students</Text>
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
          Read article
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
              <Text type="secondary">Author: {blog.author}</Text>
              <Text type="secondary">📅 {blog.publishDate}</Text>
              <Text type="secondary">👁️ {blog.readCount} reads</Text>
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
          Book appointment
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
              <Text type="secondary">Experience: {consultant.experience}</Text>
              <Text type="secondary">⭐ {consultant.rating}</Text>
              <Text type="secondary">📅 {consultant.availableSlots} available slots</Text>
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
          Start assessment
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
              <Text type="secondary">❓ {assessment.questions} questions</Text>
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
          <Title level={3}>🔍 Search</Title>
          <Search
            placeholder="Search for courses, articles, consultants..."
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            style={{ marginBottom: '16px' }}
          />
          
          <Space wrap>
            <Select
              placeholder="Category"
              style={{ width: 150 }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="all">All categories</Option>
              <Option value="Basic">Basic</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Professional">Professional</Option>
            </Select>
            
            <Select
              placeholder="Difficulty"
              style={{ width: 120 }}
              value={filters.difficulty}
              onChange={(value) => handleFilterChange('difficulty', value)}
            >
              <Option value="all">All</Option>
              <Option value="Basic">Basic</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
            
            <Select
              placeholder="Duration"
              style={{ width: 120 }}
              value={filters.duration}
              onChange={(value) => handleFilterChange('duration', value)}
            >
              <Option value="all">All</Option>
              <Option value="2">≤ 2 weeks</Option>
              <Option value="4">≤ 4 weeks</Option>
              <Option value="6">≤ 6 weeks</Option>
            </Select>
          </Space>
        </div>

        {searchTerm && (
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary">
              Found {getTotalResults()} results for "{searchTerm}"
            </Text>
          </div>
        )}

        {searchTerm ? (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`All (${getTotalResults()})`} key="all">
              {getTotalResults() === 0 ? (
                <Empty description="No results found" />
              ) : (
                <div>
                  {results.courses.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📚 Courses ({results.courses.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.courses}
                        renderItem={renderCourseItem}
                      />
                    </div>
                  )}
                  
                  {results.blogs.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📝 Articles ({results.blogs.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.blogs}
                        renderItem={renderBlogItem}
                      />
                    </div>
                  )}
                  
                  {results.consultants.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>👨‍⚕️ Consultants ({results.consultants.length})</Title>
                      <List
                        loading={loading}
                        dataSource={results.consultants}
                        renderItem={renderConsultantItem}
                      />
                    </div>
                  )}
                  
                  {results.assessments.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Title level={4}>📋 Assessments ({results.assessments.length})</Title>
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
            
            <TabPane tab={`Courses (${results.courses.length})`} key="courses">
              <List
                loading={loading}
                dataSource={results.courses}
                renderItem={renderCourseItem}
                locale={{ emptyText: <Empty description="No courses found" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Articles (${results.blogs.length})`} key="blogs">
              <List
                loading={loading}
                dataSource={results.blogs}
                renderItem={renderBlogItem}
                locale={{ emptyText: <Empty description="No articles found" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Consultants (${results.consultants.length})`} key="consultants">
              <List
                loading={loading}
                dataSource={results.consultants}
                renderItem={renderConsultantItem}
                locale={{ emptyText: <Empty description="No consultants found" /> }}
              />
            </TabPane>
            
            <TabPane tab={`Assessments (${results.assessments.length})`} key="assessments">
              <List
                loading={loading}
                dataSource={results.assessments}
                renderItem={renderAssessmentItem}
                locale={{ emptyText: <Empty description="No assessments found" /> }}
              />
            </TabPane>
          </Tabs>
        ) : (
          <Empty 
            description="Enter a keyword to start searching"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default SearchPage; 