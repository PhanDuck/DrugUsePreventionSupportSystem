import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Tag, Spin } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import appointmentService from '../../services/appointmentService';
import assessmentService from '../../services/assessmentService';
import authService from '../../services/authService';
import { api } from '../../services/mockApi';

export default function ConsultantDashboard() {
  // Giả lập lấy id tư vấn viên từ localStorage hoặc props
  const consultantId = 'tvv1'; // Thay bằng logic lấy id thực tế nếu có
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getConsultantAppointments(consultantId).then(data => {
      setAppointments(data);
      setLoading(false);
    });
  }, [consultantId]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>Dashboard Tư Vấn Viên</h2>
      {loading && <p>Đang tải...</p>}
      {!loading && (
        <>
          <h3>Lịch trình tư vấn</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Link Meet</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt.id}>
                  <td>{appt.date}</td>
                  <td>{appt.start} - {appt.end}</td>
                  <td>{appt.customerName}</td>
                  <td>{appt.customerEmail}</td>
                  <td>{appt.customerPhone}</td>
                  <td>{appt.description}</td>
                  <td>{appt.status}</td>
                  <td><a href={appt.meetLink} target="_blank" rel="noopener noreferrer">Tham gia</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <b>Tổng số khách đã đặt lịch: {appointments.length}</b>
          </div>
        </>
      )}
    </div>
  );
} 