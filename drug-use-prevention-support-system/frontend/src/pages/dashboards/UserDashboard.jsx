import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser && currentUser.id) {
      fetchUserStats(currentUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserStats = async (userId) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/assessment-results/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserStats({
          assessmentsCompleted: data.length,
          latestAssessment: data.length > 0 ? data[0] : null,
          assessmentHistory: data || []
        });
      }
    } catch (error) {
      console.log('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelInfo = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
      case 'thấp':
        return { text: 'Nguy cơ thấp', color: '#52c41a', bgColor: '#f6ffed' };
      case 'moderate':
      case 'trung bình':
        return { text: 'Nguy cơ trung bình', color: '#fa8c16', bgColor: '#fff7e6' };
      case 'high':
      case 'cao':
        return { text: 'Nguy cơ cao', color: '#f5222d', bgColor: '#fff2f0' };
      default:
        return { text: riskLevel || 'Không xác định', color: '#666', bgColor: '#f5f5f5' };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Đang tải thông tin...</p>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Welcome Header */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '40px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#262626'
        }}>
          Xin chào, {getUserDisplayName()}!
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#666',
          marginBottom: '0'
        }}>
          Chào mừng bạn đến với bảng điều khiển cá nhân
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* Assessment Stats */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#e6f7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '20px'
            }}>
              📊
            </div>
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '4px',
                color: '#262626'
              }}>
                Đánh giá đã hoàn thành
              </h3>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1890ff',
                margin: 0
              }}>
                {userStats?.assessmentsCompleted || 0}
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            margin: 0
          }}>
            Số lượng bài đánh giá bạn đã thực hiện
          </p>
        </div>

        {/* Latest Assessment */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#f6ffed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '20px'
            }}>
              🎯
            </div>
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '4px',
                color: '#262626'
              }}>
                Đánh giá gần nhất
              </h3>
              {userStats?.latestAssessment ? (
                <div>
                  <span style={{
                    background: getRiskLevelInfo(userStats.latestAssessment.riskLevel).bgColor,
                    color: getRiskLevelInfo(userStats.latestAssessment.riskLevel).color,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: `1px solid ${getRiskLevelInfo(userStats.latestAssessment.riskLevel).color}30`
                  }}>
                    {getRiskLevelInfo(userStats.latestAssessment.riskLevel).text}
                  </span>
                </div>
              ) : (
                <p style={{ 
                  fontSize: '14px', 
                  color: '#999',
                  margin: 0
                }}>
                  Chưa có đánh giá nào
                </p>
              )}
            </div>
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            margin: 0
          }}>
            {userStats?.latestAssessment 
              ? `Điểm số: ${userStats.latestAssessment.totalScore}`
              : 'Hãy thực hiện đánh giá đầu tiên'
            }
          </p>
        </div>

        {/* Progress Card */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#fff2f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '20px'
            }}>
              📈
            </div>
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '4px',
                color: '#262626'
              }}>
                Tiến trình
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#666',
                margin: 0
              }}>
                Theo dõi sự phát triển của bạn
              </p>
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min((userStats?.assessmentsCompleted || 0) * 20, 100)}%`,
              height: '100%',
              background: '#52c41a',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: '#262626'
        }}>
          Hành động nhanh
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/surveys')}
            style={{
              background: '#1890ff',
              border: '1px solid #1890ff',
              color: '#fff',
              padding: '16px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#40a9ff';
              e.target.style.borderColor = '#40a9ff';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1890ff';
              e.target.style.borderColor = '#1890ff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>📋</span>
            Thực hiện đánh giá mới
          </button>

          <button
            onClick={() => navigate('/appointments')}
            style={{
              background: '#fff',
              border: '1px solid #d9d9d9',
              color: '#595959',
              padding: '16px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#1890ff';
              e.target.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#595959';
              e.target.style.borderColor = '#d9d9d9';
            }}
          >
            <span>💬</span>
            Đặt lịch tư vấn
          </button>

          <button
            onClick={() => navigate('/courses')}
            style={{
              background: '#fff',
              border: '1px solid #d9d9d9',
              color: '#595959',
              padding: '16px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#1890ff';
              e.target.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#595959';
              e.target.style.borderColor = '#d9d9d9';
            }}
          >
            <span>📚</span>
            Xem khóa học
          </button>
        </div>
      </div>

      {/* Assessment History */}
      {userStats?.assessmentHistory && userStats.assessmentHistory.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#262626'
          }}>
            Lịch sử đánh giá
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {userStats.assessmentHistory.slice(0, 5).map((assessment, index) => {
              const riskInfo = getRiskLevelInfo(assessment.riskLevel);
              return (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fafafa'
                  }}
                >
                  <div>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: '500', 
                      marginBottom: '4px',
                      color: '#262626'
                    }}>
                      Đánh giá #{userStats.assessmentHistory.length - index}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      margin: 0
                    }}>
                      Điểm số: {assessment.totalScore}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      background: riskInfo.bgColor,
                      color: riskInfo.color,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${riskInfo.color}30`
                    }}>
                      {riskInfo.text}
                    </span>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#999',
                      margin: '4px 0 0 0'
                    }}>
                      {new Date(assessment.submittedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {userStats.assessmentHistory.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ 
                color: '#666', 
                fontSize: '14px',
                margin: 0
              }}>
                Và {userStats.assessmentHistory.length - 5} đánh giá khác...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {(!userStats?.assessmentHistory || userStats.assessmentHistory.length === 0) && (
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#262626'
          }}>
            Chưa có đánh giá nào
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            marginBottom: '24px'
          }}>
            Hãy bắt đầu với đánh giá đầu tiên để theo dõi tiến trình của bạn
          </p>
          <button
            onClick={() => navigate('/surveys')}
            style={{
              background: '#1890ff',
              border: '1px solid #1890ff',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#40a9ff';
              e.target.style.borderColor = '#40a9ff';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1890ff';
              e.target.style.borderColor = '#1890ff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Bắt đầu đánh giá
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard; 