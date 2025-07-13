import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assessmentService from '../services/assessmentService';
import authService from '../services/authService';

const SurveyPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAssessmentList, setShowAssessmentList] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentService.getAssessments();
      setAssessments(data);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAssessment = async (assessment) => {
    try {
      setIsLoading(true);
      setSelectedAssessment(assessment);
      
      const data = await assessmentService.getAssessmentQuestions(assessment.id);
      setQuestions(data);
      
      // COMPREHENSIVE DEBUG FOR QUESTIONS STRUCTURE
      console.log('🔍 === QUESTIONS STRUCTURE DEBUG ===');
      console.log('🔍 Assessment ID:', assessment.id);
      console.log('🔍 Raw questions data:', data);
      console.log('🔍 Questions count:', data?.length);
      
      if (data && data.length > 0) {
        console.log('🔍 First question structure:', data[0]);
        console.log('🔍 First question ID:', data[0]?.id);
        console.log('🔍 First question options:', data[0]?.options);
        
        if (data[0]?.options && data[0].options.length > 0) {
          console.log('🔍 First option structure:', data[0].options[0]);
          console.log('🔍 First option value:', data[0].options[0]?.value);
          console.log('🔍 First option value type:', typeof data[0].options[0]?.value);
        }
      }
      console.log('🔍 === END DEBUG ===');
      
      // Cache questions in service for answer text mapping
      assessmentService.setCachedQuestions(data);
      
      setAnswers({});
      setCurrentQuestion(0);
      setShowAssessmentList(false);
      
      // Store assessment ID for later use
      assessmentService.currentAssessmentId = assessment.id;
      
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Unable to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    console.log('🔍 handleAnswerChange called with value:', value, typeof value);
    console.log('🔍 Current question:', questions[currentQuestion]);
    console.log('🔍 Current question ID:', questions[currentQuestion]?.id);
    console.log('🔍 Current question index:', currentQuestion);
    
    const numericValue = parseInt(value, 10);
    console.log(`🔍 Answer changed for question ${questions[currentQuestion].id}: "${value}" (${typeof value}) -> ${numericValue} (${typeof numericValue})`);
    
    setAnswers(prev => {
      const updated = {
        ...prev,
        [questions[currentQuestion].id]: numericValue
      };
      console.log('🔍 Updated answers object:', updated);
      console.log('🔍 Keys in answers:', Object.keys(updated));
      console.log('🔍 Values in answers:', Object.values(updated));
      return updated;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitSurvey = async () => {
    try {
      setIsSubmitting(true);

      // Debug logging
      console.log('🔍 Submitting survey with', Object.keys(answers).length, 'answers');
      console.log('🔍 Raw answers object:', answers);
      console.log('🔍 Questions available:', questions.length);
      console.log('🔍 Question IDs from questions array:', questions.map(q => ({ id: q.id, order: q.orderIndex })));
      console.log('🔍 Answer keys:', Object.keys(answers));
      console.log('🔍 Answer entries:', Object.entries(answers));

      let result;
      if (isAuthenticated) {
        console.log('🔍 Submitting as authenticated user...');
        // Convert answers object to format expected by backend
        console.log('🔍 About to call formatAnswersForBackend with:', answers);
        const answerArray = assessmentService.formatAnswersForBackend(answers);
        console.log('🔍 Formatted answer array:', answerArray);
        result = await assessmentService.submitAssessment(answerArray);
      } else {
        console.log('🔍 Calculating as anonymous user...');
        // Pass raw answers - calculateAssessment will format them internally
        result = await assessmentService.calculateAssessment(answers);
      }

      console.log('✅ Assessment completed successfully');
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('❌ Error submitting survey:', error);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      alert('An error occurred while submitting the assessment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartSurvey = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setShowResult(false);
    setShowAssessmentList(true);
    setSelectedAssessment(null);
  };

  const getRiskLevelInfo = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return { text: 'Low Risk', color: '#52c41a', bgColor: '#f6ffed' };
      case 'moderate':
        return { text: 'Moderate Risk', color: '#fa8c16', bgColor: '#fff7e6' };
      case 'high':
        return { text: 'High Risk', color: '#f5222d', bgColor: '#fff2f0' };
      default:
        return { text: riskLevel || 'Undetermined', color: '#666', bgColor: '#f5f5f5' };
    }
  };

  const debugQuestionIds = async () => {
    try {
      await assessmentService.debugQuestionIds();
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  const debugCRAFFTScoring = async () => {
    try {
      const result = await assessmentService.debugCRAFFTScoring();
      alert('Debug result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug error: ' + error.message);
    }
  };

  const debugASSISTScoring = async () => {
    try {
      const result = await assessmentService.debugASSISTScoring();
      alert('ASSIST Debug result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('ASSIST Debug error:', error);
      alert('ASSIST Debug error: ' + error.message);
    }
  };

  const debugAUDITScoring = async () => {
    try {
      const result = await assessmentService.debugAUDITScoring();
      alert('AUDIT Debug result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('AUDIT Debug error:', error);
      alert('AUDIT Debug error: ' + error.message);
    }
  };

  const debugDAST10Scoring = async () => {
    try {
      const result = await assessmentService.debugDAST10Scoring();
      alert('DAST-10 Debug result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('DAST-10 Debug error:', error);
      alert('DAST-10 Debug error: ' + error.message);
    }
  };

  if (isLoading) {
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
        <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
      </div>
    );
  }

  // Assessment Selection Screen
  if (showAssessmentList) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#262626'
          }}>
            Choose Assessment Type
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            marginBottom: '0'
          }}>
            Please select the assessment that is appropriate for you
          </p>
        </div>

        {/* Debug Buttons - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h3 style={{ color: '#0ea5e9', marginBottom: '12px', fontSize: '16px' }}>🔧 Debug Tools (Development Only)</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={debugQuestionIds}
                style={{
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Debug Question IDs
              </button>
              <button
                onClick={debugCRAFFTScoring}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Test CRAFFT Scoring  
              </button>
              <button
                onClick={debugASSISTScoring}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Test ASSIST Scoring  
              </button>
              <button
                onClick={debugAUDITScoring}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Test AUDIT Scoring  
              </button>
              <button
                onClick={debugDAST10Scoring}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Test DAST-10 Scoring  
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', marginBottom: '0' }}>
              ✨ Check browser console for detailed logs
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => startAssessment(assessment)}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
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
                    fontSize: '20px', 
                    fontWeight: '600', 
                    marginBottom: '4px',
                    color: '#262626'
                  }}>
                    {assessment.title}
                  </h3>
                  <span style={{
                    background: '#f6ffed',
                    color: '#52c41a',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {assessment.assessmentType?.targetAgeGroup || 'All ages'}
                  </span>
                </div>
              </div>
              
              <p style={{ 
                color: '#666', 
                marginBottom: '20px',
                lineHeight: 1.6
              }}>
                {assessment.description || 'Assess risk level and provide appropriate recommendations'}
              </p>
              
              <button style={{
                background: '#1890ff',
                border: '1px solid #1890ff',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease'
              }}>
                Start Assessment
              </button>
            </div>
          ))}
        </div>

        {assessments.length === 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#262626'
            }}>
              No assessments available
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#666'
            }}>
              Please contact administrator to add assessments
            </p>
          </div>
        )}
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const riskInfo = getRiskLevelInfo(result.riskLevel);
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#262626'
          }}>
            Assessment Results
          </h2>
          
          <div style={{
            background: '#f0f0f0',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#262626'
            }}>
              {selectedAssessment?.title}
            </h4>
          </div>

          <div style={{
            background: riskInfo.bgColor,
            border: `1px solid ${riskInfo.color}30`,
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              color: riskInfo.color,
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              {riskInfo.text}
            </h3>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>
              Total Score: <strong>{result.totalScore}</strong>
            </p>
            
            {/* Risk Description */}
            {result.riskDescription && (
              <p style={{ 
                fontSize: '16px', 
                color: '#666', 
                lineHeight: 1.6,
                marginBottom: '20px',
                fontStyle: 'italic'
              }}>
                {result.riskDescription}
              </p>
            )}
            
            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#262626',
                  marginBottom: '12px'
                }}>
                  📋 Recommendations:
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  lineHeight: 1.6
                }}>
                  {Array.isArray(result.recommendations) 
                    ? result.recommendations.map((rec, index) => (
                        <li key={index} style={{ 
                          fontSize: '14px', 
                          color: '#666',
                          marginBottom: '8px'
                        }}>
                          {rec}
                        </li>
                      ))
                    : <li style={{ 
                        fontSize: '14px', 
                        color: '#666'
                      }}>
                        {result.recommendations}
                      </li>
                  }
                </ul>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div style={{
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#1890ff', fontSize: '14px', margin: 0 }}>
                ✅ Results have been saved to your profile
              </p>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={restartSurvey}
              style={{
                background: '#fff',
                border: '1px solid #d9d9d9',
                color: '#595959',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Take Another Assessment
            </button>
            
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#1890ff',
                border: '1px solid #1890ff',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Back to Home
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: '#52c41a',
                  border: '1px solid #52c41a',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Register to Save Results
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Survey Questions Screen
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Progress Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#262626',
            margin: 0
          }}>
            {selectedAssessment?.title || 'Risk Assessment'}
          </h1>
          <span style={{ 
            fontSize: '14px', 
            color: '#666',
            fontWeight: '500'
          }}>
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        <div style={{
          width: '100%',
          height: '8px',
          background: '#f5f5f5',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#1890ff',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        marginBottom: '20px'
      }}>
        {questions[currentQuestion] && (
          <>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '30px',
              lineHeight: 1.6,
              color: '#262626'
            }}>
              {questions[currentQuestion].question}
            </h2>

            <div style={{ marginBottom: '30px' }}>
              {questions[currentQuestion].options && questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'block',
                    padding: '16px',
                    margin: '8px 0',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: answers[questions[currentQuestion].id] === option.value ? '#e6f7ff' : '#fff',
                    borderColor: answers[questions[currentQuestion].id] === option.value ? '#1890ff' : '#d9d9d9'
                  }}
                  onMouseEnter={(e) => {
                    if (answers[questions[currentQuestion].id] !== option.value) {
                      e.target.style.borderColor = '#1890ff';
                      e.target.style.background = '#f6ffed';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[questions[currentQuestion].id] !== option.value) {
                      e.target.style.borderColor = '#d9d9d9';
                      e.target.style.background = '#fff';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestion].id}`}
                    value={option.value}
                    checked={answers[questions[currentQuestion].id] === option.value}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <span style={{ 
                    fontSize: '16px',
                    color: answers[questions[currentQuestion].id] === option.value ? '#1890ff' : '#262626',
                    fontWeight: answers[questions[currentQuestion].id] === option.value ? '500' : '400'
                  }}>
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          style={{
            background: currentQuestion === 0 ? '#f5f5f5' : '#fff',
            border: '1px solid #d9d9d9',
            color: currentQuestion === 0 ? '#bfbfbf' : '#595959',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Previous Question
        </button>

        <button
          onClick={() => {
            setShowAssessmentList(true);
            setSelectedAssessment(null);
            setQuestions([]);
            setAnswers({});
            setCurrentQuestion(0);
          }}
          style={{
            background: '#fff',
            border: '1px solid #d9d9d9',
            color: '#595959',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Choose Different Assessment
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={submitSurvey}
            disabled={answers[questions[currentQuestion]?.id] === undefined || isSubmitting}
            style={{
              background: (answers[questions[currentQuestion]?.id] === undefined || isSubmitting) ? '#f5f5f5' : '#1890ff',
              border: '1px solid #1890ff',
              color: (answers[questions[currentQuestion]?.id] === undefined || isSubmitting) ? '#bfbfbf' : '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (answers[questions[currentQuestion]?.id] === undefined || isSubmitting) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isSubmitting ? 'Processing...' : 'Complete'}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={answers[questions[currentQuestion]?.id] === undefined}
            style={{
              background: answers[questions[currentQuestion]?.id] === undefined ? '#f5f5f5' : '#1890ff',
              border: '1px solid #1890ff',
              color: answers[questions[currentQuestion]?.id] === undefined ? '#bfbfbf' : '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: answers[questions[currentQuestion]?.id] === undefined ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Info Note */}
      <div style={{
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px'
      }}>
        <p style={{ 
          color: '#52c41a', 
          fontSize: '14px', 
          margin: 0,
          lineHeight: 1.5
        }}>
          💡 <strong>Note:</strong> This is an initial screening tool. Results are for reference only. 
          {isAuthenticated 
            ? ' Results will be saved to your profile to track your progress.'
            : ' Register an account to save and track your assessment results.'
          }
        </p>
      </div>
    </div>
  );
};

export default SurveyPage; 