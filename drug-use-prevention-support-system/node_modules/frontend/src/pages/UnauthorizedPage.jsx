import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you do not have permission to access this page."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default UnauthorizedPage; 