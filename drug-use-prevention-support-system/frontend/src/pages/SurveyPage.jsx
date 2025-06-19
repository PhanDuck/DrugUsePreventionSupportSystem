import React, { useState } from 'react';
import { Typography, Card, Button, Layout, Row, Col, Input, Alert } from 'antd';
import AssistSurvey from '../components/AssistSurvey';
import CrafftSurvey from '../components/CrafftSurvey';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function SurveyPage() {
  const [age, setAge] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyType, setSurveyType] = useState(null);
  const [error, setError] = useState('');

  const handleStart = () => {
    const ageNum = Number(age);
    if (!ageNum || ageNum < 12) {
      setError('Vui lòng nhập tuổi hợp lệ (từ 12 trở lên).');
      return;
    }
    setError('');
    setShowSurvey(true);
    if (ageNum >= 18) setSurveyType('assist');
    else setSurveyType('crafft');
  };

  return (
    <Layout style={{ minHeight: '50vh'  }}>
      <Content
        style={{
          padding: 'clamp(8px, 2vw, 16px)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          height: '100%'
        }}
      >
        {}
        <Row justify="center">
          <Col xs={24} md={16}>
            <Card style={{ padding: 'clamp(24px, 4vw, 32px)', maxHeight: '60vh', overflowY: 'auto' }}>
              <Title level={3} style={{ fontSize: 'clamp(20px, 3vw, 24px)', marginBottom: 'clamp(16px, 2vw, 24px)' }}>
                Khảo sát phòng ngừa ma túy
              </Title>
              {!showSurvey && (
                <>
                  <Paragraph>Vui lòng nhập tuổi của bạn để bắt đầu khảo sát:</Paragraph>
                  <Input
                    type="number"
                    min={12}
                    max={100}
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    style={{ width: 120, marginRight: 16 }}
                  />
                  <Button type="primary" onClick={handleStart}>Bắt đầu khảo sát</Button>
                  {error && <Alert type="error" message={error} style={{ marginTop: 16 }} />}
                </>
              )}
              {showSurvey && surveyType === 'assist' && (
                <AssistSurvey />
              )}
              {showSurvey && surveyType === 'crafft' && (
                <CrafftSurvey />
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}