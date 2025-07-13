import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ 
  size = 'large', 
  text = 'Loading...', 
  fullScreen = false,
  style = {}
}) => {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    ...style
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    ...style
  };

  return (
    <div style={containerStyle}>
      <Spin size={size} />
      {text && (
        <div style={{ 
          marginTop: '16px', 
          color: '#666',
          fontSize: '14px'
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 