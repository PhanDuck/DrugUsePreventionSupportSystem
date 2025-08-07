import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Result, Button, Spin, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import paymentService from '../services/paymentService';
import courseService from '../services/courseService';
import appointmentService from '../services/appointmentService';

const { Title, Paragraph } = Typography;

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    processPaymentReturn();
  }, []);

  const processPaymentReturn = async () => {
    try {
      // Get all VNPay return parameters
      const params = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      console.log('🔄 Processing payment return:', params);

      // Check if this is from VNPay demo (has success parameter)
      if (params.success) {
        console.log('✅ VNPay Demo payment return detected');
        
        const isSuccess = params.success === 'true';
        const courseId = params.courseId;
        const appointmentId = params.appointmentId;
        
        if (isSuccess && courseId) {
          // For demo, simulate successful course enrollment
          console.log('🎓 Completing course enrollment for demo payment');
          
          try {
            // Actually register the course for the user
            const enrollmentResult = await courseService.completeEnrollmentAfterPayment(
              courseId, 
              { transactionId: 'DEMO_' + Date.now() }
            );
            
            if (enrollmentResult.success) {
              setPaymentResult({
                success: true,
                transactionId: 'DEMO_' + Date.now(),
                amount: params.vnp_Amount || '190000', // Use VNPay amount directly (already in VND)
                courseId: courseId,
                message: 'Payment successful! Course access granted.',
                enrolled: true
              });
            } else {
              setPaymentResult({
                success: false,
                message: `Payment successful but enrollment failed: ${enrollmentResult.error}`,
                transactionId: 'DEMO_' + Date.now()
              });
            }
          } catch (enrollmentError) {
            console.error('❌ Error enrolling in course after demo payment:', enrollmentError);
            setPaymentResult({
              success: false,
              message: 'Payment successful but enrollment failed'
            });
          }
        } else {
          // Payment failed or missing required parameters
          setPaymentResult({
            success: false,
            message: 'Payment failed in demo'
          });
        }
        return;
      }

      // Real VNPay return - process with backend
      const result = await paymentService.processPaymentReturn(params);
      
      if (result.success && result.courseId) {
        // Payment successful, now complete enrollment
        console.log('✅ Payment successful, completing enrollment for course:', result.courseId);
        
        const enrollmentResult = await courseService.completeEnrollmentAfterPayment(
          result.courseId, 
          { transactionId: result.transactionId }
        );
        
        if (enrollmentResult.success) {
          setPaymentResult({
            success: true,
            transactionId: result.transactionId,
            amount: params.vnp_Amount,
            courseId: result.courseId,
            message: 'Payment successful! Course access granted.',
            enrolled: true
          });
        } else {
          setPaymentResult({
            success: false,
            message: `Payment successful but enrollment failed: ${enrollmentResult.error}`,
            transactionId: result.transactionId
          });
        }
      } else if (result.success && result.appointmentId) {
        // Payment successful for appointment
        console.log('✅ Payment successful for appointment:', result.appointmentId);
        
        setPaymentResult({
          success: true,
          transactionId: result.transactionId,
          amount: params.vnp_Amount,
          appointmentId: result.appointmentId,
          message: 'Payment successful! Appointment confirmed.',
          enrolled: false
        });
      } else if (result.success) {
        // Payment successful but no courseId or appointmentId
        setPaymentResult({
          success: true,
          transactionId: result.transactionId,
          amount: params.vnp_Amount,
          message: 'Payment successful!',
          enrolled: false
        });
      } else {
        setPaymentResult({
          success: false,
          message: result.error || 'Payment failed'
        });
      }
    } catch (error) {
      console.error('❌ Error processing payment return:', error);
      setPaymentResult({
        success: false,
        message: 'Error processing payment'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCourse = () => {
    if (paymentResult?.courseId) {
      navigate(`/courses/${paymentResult.courseId}`);
    } else {
      navigate('/courses');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Card>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
            Processing payment...
          </Paragraph>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      padding: '24px'
    }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        {paymentResult?.success ? (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Payment Successful!"
            subTitle={paymentResult.message}
            extra={[
              paymentResult.courseId ? (
                <Button 
                  type="primary" 
                  key="course" 
                  onClick={handleGoToCourse}
                >
                  Access Course
                </Button>
              ) : null,
              <Button key="home" onClick={handleGoHome}>
                Go Home
              </Button>
            ]}
          >
            <div style={{ marginTop: 16 }}>
              <Paragraph>
                <strong>Transaction ID:</strong> {paymentResult.transactionId}
              </Paragraph>
              {paymentResult.amount && (
                <Paragraph>
                  <strong>Amount:</strong> {(() => {
                    console.log('💰 DEBUG - Display amount:', paymentResult.amount, 'Type:', typeof paymentResult.amount);
                    return parseInt(paymentResult.amount).toLocaleString();
                  })()} VND
                </Paragraph>
              )}
            </div>
          </Result>
        ) : (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Payment Failed"
            subTitle={paymentResult?.message || 'Something went wrong with your payment'}
            extra={[
              <Button 
                type="primary" 
                key="retry" 
                onClick={() => navigate('/courses')}
              >
                Back to Courses
              </Button>,
              <Button key="home" onClick={handleGoHome}>
                Go Home
              </Button>
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default PaymentReturnPage; 