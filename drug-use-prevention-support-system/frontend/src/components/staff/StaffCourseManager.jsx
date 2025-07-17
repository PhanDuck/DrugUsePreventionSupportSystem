import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  message,
  Spin,
  Empty
} from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import CourseList from './CourseList';
import CourseEditor from './CourseEditor';
import LessonManager from './LessonManager';
import ContentManager from './ContentManager';
import CourseStatistics from './CourseStatistics';
import staffCourseService from '../../services/staffCourseService';

const { Title } = Typography;
const { TabPane } = Tabs;

const StaffCourseManager = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalLessons: 0,
    totalContent: 0
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await staffCourseService.getAllCourses();
      if (response.success) {
        setCourses(response.data);
        calculateStats(response.data);
      } else {
        message.error('Không thể tải danh sách khóa học: ' + response.error);
      }
    } catch (error) {
      message.error('Lỗi khi tải khóa học: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData) => {
    setStats({
      totalCourses: coursesData.length,
      publishedCourses: coursesData.filter(course => course.status === 'open').length,
      totalLessons: coursesData.reduce((sum, course) => sum + (course.totalLessons || 0), 0),
      totalContent: coursesData.reduce((sum, course) => sum + (course.totalContent || 0), 0)
    });
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseEditor(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseEditor(true);
  };

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
    calculateStats([...courses, newCourse]);
    setShowCourseEditor(false);
    message.success('Tạo khóa học thành công!');
  };

  const handleCourseUpdated = (updatedCourse) => {
    const newCourses = courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    );
    setCourses(newCourses);
    calculateStats(newCourses);
    setShowCourseEditor(false);
    message.success('Cập nhật khóa học thành công!');
  };

  const handleCourseDeleted = (courseId) => {
    const newCourses = courses.filter(course => course.id !== courseId);
    setCourses(newCourses);
    calculateStats(newCourses);
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(null);
    }
    message.success('Xóa khóa học thành công!');
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveTab('lessons');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>
            <BookOutlined /> Quản Lý Khóa Học
          </Title>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateCourse}
              size="large"
            >
              Tạo Khóa Học Mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng Khóa Học"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã Xuất Bản"
              value={stats.publishedCourses}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng Bài Học"
              value={stats.totalLessons}
              prefix={<VideoCameraOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Nội Dung"
              value={stats.totalContent}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          tabBarExtraContent={
            selectedCourse && (
              <Badge count={selectedCourse.totalLessons || 0} showZero>
                <Button type="text">
                  {selectedCourse.title}
                </Button>
              </Badge>
            )
          }
        >
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Danh Sách Khóa Học
              </span>
            }
            key="courses"
          >
            <Spin spinning={loading}>
              {courses.length > 0 ? (
                <CourseList
                  courses={courses}
                  onEdit={handleEditCourse}
                  onDelete={handleCourseDeleted}
                  onSelect={handleSelectCourse}
                  loading={loading}
                />
              ) : (
                <Empty
                  description="Chưa có khóa học nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCourse}>
                    Tạo Khóa Học Đầu Tiên
                  </Button>
                </Empty>
              )}
            </Spin>
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Quản Lý Bài Học
              </span>
            }
            key="lessons"
            disabled={!selectedCourse}
          >
            {selectedCourse && (
              <LessonManager 
                course={selectedCourse}
                onCourseUpdate={handleCourseUpdated}
              />
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <VideoCameraOutlined />
                Nội Dung Học Tập
              </span>
            }
            key="content"
            disabled={!selectedCourse}
          >
            {selectedCourse && (
              <ContentManager 
                course={selectedCourse}
                onCourseUpdate={handleCourseUpdated}
              />
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Thống Kê
              </span>
            }
            key="statistics"
            disabled={!selectedCourse}
          >
            {selectedCourse && (
              <CourseStatistics course={selectedCourse} />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Course Editor Modal */}
      <CourseEditor
        visible={showCourseEditor}
        course={editingCourse}
        onCancel={() => setShowCourseEditor(false)}
        onSuccess={editingCourse ? handleCourseUpdated : handleCourseCreated}
      />
    </div>
  );
};

export default StaffCourseManager; 