import api from '../config/axios';

class AssessmentService {
  
  // ===== PUBLIC APIs (No authentication required) =====
  
  /**
   * Get all available assessments
   */
  async getAssessments() {
    try {
      console.log('🔍 Calling GET /assessments...');
      const response = await api.get('/assessments');
      console.log('✅ GET /assessments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching assessments:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  }

  /**
   * Get default assessment questions (for anonymous users)
   */
  async getQuestions() {
    try {
      console.log('🔍 Loading default questions...');
      // First get all assessments
      const assessmentsResponse = await api.get('/assessments');
      const assessments = assessmentsResponse.data;
      console.log('✅ Assessments loaded:', assessments);
      
      if (!assessments || assessments.length === 0) {
        throw new Error('Không có bài đánh giá nào có sẵn');
      }
      
      // Get questions from the first assessment
      const firstAssessment = assessments[0];
      console.log('🔍 Getting questions for assessment:', firstAssessment.id);
      const questionsResponse = await api.get(`/assessments/${firstAssessment.id}/questions`);
      console.log('✅ Questions loaded:', questionsResponse.data);
      
      // Store the assessment ID for later use
      this.currentAssessmentId = firstAssessment.id;
      
      return questionsResponse.data;
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  }

  /**
   * Get assessment questions by ID
   */
  async getAssessmentQuestions(assessmentId) {
    try {
      const response = await api.get(`/assessments/${assessmentId}/questions`);
      // Cache questions for answer text mapping
      this.setCachedQuestions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment questions:', error);
      throw error;
    }
  }

  /**
   * Calculate assessment result (Anonymous mode - no login required)
   */
  async calculateAssessment(answers) {
    try {
      // Get assessment ID if not set
      if (!this.currentAssessmentId) {
        const assessments = await this.getAssessments();
        this.currentAssessmentId = assessments[0]?.id;
      }

      const payload = {
        assessmentId: this.currentAssessmentId,
        userId: null, // Anonymous
        answers: this.formatAnswersForBackend(answers)
      };
      
      console.log('🔍 Calculating assessment - payload:', { 
        assessmentId: payload.assessmentId, 
        answersCount: payload.answers.length 
      });
      
      const response = await api.post('/assessments/calculate', payload);
      
      console.log('✅ Assessment calculated - Score:', response.data.totalScore, 'Level:', response.data.riskLevel);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error calculating assessment:', error);
      console.error('❌ Error response data:', error.response?.data);
      throw error;
    }
  }

  /**
   * Submit assessment (Authenticated mode - login required)
   */
  async submitAssessment(answers) {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      console.log('🔍 Submit Assessment Debug:');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('User:', user);
      console.log('User ID:', user?.id);
      
      // Get assessment ID if not set
      if (!this.currentAssessmentId) {
        const assessments = await this.getAssessments();
        this.currentAssessmentId = assessments[0]?.id;
      }

      const payload = {
        assessmentId: this.currentAssessmentId,
        userId: user?.id,
        answers: this.formatAnswersForBackend(answers)
      };
      
      console.log('🔍 Payload:', payload);
      console.log('🔍 Headers will include Authorization:', `Bearer ${token?.substring(0, 20)}...`);
      
      const response = await api.post('/assessments/submit', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error submitting assessment:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      throw error;
    }
  }

  /**
   * Get user assessment results (Authenticated)
   */
  async getUserResults(userId, token) {
    try {
      const response = await api.get(`/assessments/results/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user results:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await api.get('/assessments/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  /**
   * Debug method to test CRAFFT scoring
   */
  async debugCRAFFTScoring() {
    try {
      console.log('🔍 Testing CRAFFT debug endpoint...');
      const response = await api.get('/test/crafft-debug');
      console.log('🔍 Debug endpoint response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error testing debug endpoint:', error);
      throw error;
    }
  }

  /**
   * Debug method to check question IDs for current assessment
   */
  async debugQuestionIds() {
    try {
      console.log('🔍 Getting comprehensive question IDs for all assessments...');
      const response = await api.get('/test/question-ids');
      console.log('🔍 Question IDs debug response:', response.data);
      
      // Also log the current assessment info if available
      if (this.currentAssessmentId) {
        console.log('🔍 Current assessment ID:', this.currentAssessmentId);
        const questions = await this.getAssessmentQuestions(this.currentAssessmentId);
        console.log('🔍 Current assessment questions:', questions);
        
        console.log('🔍 Question ID mapping for current assessment:');
        questions.forEach((q, index) => {
          console.log(`  Index: ${index}, ID: ${q.id}, Order: ${q.orderIndex}, Text: ${q.question.substring(0, 50)}...`);
          console.log(`  Options:`, q.options);
          if (q.options && q.options.length > 0) {
            console.log(`  Option structures:`, q.options.map(opt => ({
              value: opt.value,
              text: opt.text,
              valueType: typeof opt.value
            })));
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error debugging question IDs:', error);
      throw error;
    }
  }

  /**
   * Debug method to test ASSIST scoring
   */
  async debugASSISTScoring() {
    try {
      console.log('🔍 Testing ASSIST debug endpoint...');
      const response = await api.get('/test/assist-debug');
      console.log('🔍 ASSIST Debug endpoint response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error testing ASSIST debug endpoint:', error);
      throw error;
    }
  }

  /**
   * Debug method to test AUDIT scoring
   */
  async debugAUDITScoring() {
    try {
      console.log('🔍 Testing AUDIT debug endpoint...');
      const response = await api.get('/test/audit-debug');
      console.log('🔍 AUDIT Debug endpoint response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error testing AUDIT debug endpoint:', error);
      throw error;
    }
  }

  /**
   * Debug method to test DAST-10 scoring
   */
  async debugDAST10Scoring() {
    try {
      console.log('🔍 Testing DAST-10 debug endpoint...');
      const response = await api.get('/test/dast10-debug');
      console.log('🔍 DAST-10 Debug endpoint response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error testing DAST-10 debug endpoint:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Format answers for backend submission
   * Fixed to handle Object answerValues and validate questionIds
   */
  formatAnswersForBackend(answers) {
    console.log('🔍 formatAnswersForBackend - Input answers:', answers);
    console.log('🔍 formatAnswersForBackend - Input type:', typeof answers);
    console.log('🔍 formatAnswersForBackend - Input keys:', Object.keys(answers));
    
    const formatted = Object.entries(answers).map(([questionId, answerValue]) => {
      console.log(`🔍 Processing entry: questionId="${questionId}" (${typeof questionId}), answerValue=`, answerValue, `(${typeof answerValue})`);
      
      // Parse questionId - ensure it's valid
      let numericQuestionId = parseInt(questionId, 10);
      if (isNaN(numericQuestionId) || numericQuestionId < 1) {
        console.error(`❌ Invalid questionId: "${questionId}" -> ${numericQuestionId}, defaulting to 1`);
        numericQuestionId = 1;
      }
      
      // Handle answerValue - could be number, string, or object
      let numericAnswerValue = 0; // Default fallback
      
      if (typeof answerValue === 'number' && !isNaN(answerValue)) {
        numericAnswerValue = answerValue;
      } else if (typeof answerValue === 'string') {
        const parsed = parseInt(answerValue, 10);
        numericAnswerValue = isNaN(parsed) ? 0 : parsed;
      } else if (typeof answerValue === 'object' && answerValue !== null) {
        // Handle object answerValue - check multiple possible properties
        if (answerValue.value !== undefined) {
          const parsed = parseInt(answerValue.value, 10);
          numericAnswerValue = isNaN(parsed) ? 0 : parsed;
        } else if (answerValue.score !== undefined) {
          const parsed = parseInt(answerValue.score, 10);
          numericAnswerValue = isNaN(parsed) ? 0 : parsed;
        } else if (answerValue.id !== undefined) {
          const parsed = parseInt(answerValue.id, 10);
          numericAnswerValue = isNaN(parsed) ? 0 : parsed;
        } else {
          console.error(`❌ Object answerValue has no recognizable value property:`, answerValue);
          // Try to convert the whole object to string then parse
          const objectStr = String(answerValue);
          const parsed = parseInt(objectStr, 10);
          numericAnswerValue = isNaN(parsed) ? 0 : parsed;
        }
      } else {
        console.error(`❌ Unexpected answerValue type: ${typeof answerValue}`, answerValue);
        numericAnswerValue = 0;
      }
      
      // Ensure values are valid
      if (isNaN(numericAnswerValue)) {
        console.error(`❌ answerValue is still NaN after processing, setting to 0`);
        numericAnswerValue = 0;
      }
      
      // Clamp answerValue to reasonable range (0-10)
      if (numericAnswerValue < 0) numericAnswerValue = 0;
      if (numericAnswerValue > 10) numericAnswerValue = 10;
      
      const answerText = this.getAnswerTextFromQuestions(numericQuestionId, numericAnswerValue);
      
      const result = {
        questionId: numericQuestionId,
        answerValue: numericAnswerValue,
        answerText: answerText
      };
      
      console.log(`✅ Formatted:`, result);
      return result;
    });
    
    // Filter out any invalid entries
    const validFormatted = formatted.filter(item => 
      !isNaN(item.questionId) && 
      !isNaN(item.answerValue) && 
      item.questionId > 0
    );
    
    console.log('🔍 Final formatted answers:', validFormatted);
    console.log('🔍 Filtered out', formatted.length - validFormatted.length, 'invalid entries');
    
    return validFormatted;
  }

  /**
   * Get answer text from question options (using cached questions)
   */
  getAnswerTextFromQuestions(questionId, answerValue) {
    if (!this.cachedQuestions) {
      // Fallback for older logic
      return this.getAnswerText(answerValue);
    }

    const question = this.cachedQuestions.find(q => q.id === questionId);
    if (!question || !question.options) {
      return this.getAnswerText(answerValue);
    }

    const option = question.options.find(opt => opt.value === answerValue);
    return option ? option.text : `Giá trị: ${answerValue}`;
  }

  /**
   * Cache questions for answer text mapping
   */
  setCachedQuestions(questions) {
    this.cachedQuestions = questions;
  }

  /**
   * Get answer text based on score (Legacy fallback)
   */
  getAnswerText(score) {
    switch (score) {
      case 0: return 'Không bao giờ';
      case 1: return 'Có';
      case 2: return 'Có, nhưng không trong 3 tháng qua';
      case 3: return 'Có, trong 3 tháng qua';
      case 4: return 'Rất thường xuyên';
      default: return `Giá trị: ${score}`;
    }
  }

  /**
   * Format answers for API submission (legacy method)
   */
  formatAnswers(questionAnswers) {
    return Object.entries(questionAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answerValue: answer.value,
      answerText: answer.text
    }));
  }

  /**
   * Get risk level color for UI
   */
  getRiskLevelColor(riskLevel) {
    switch (riskLevel) {
      case 'THẤP': return '#52c41a'; // Green
      case 'TRUNG BÌNH': return '#faad14'; // Orange  
      case 'CAO': return '#f5222d'; // Red
      default: return '#1890ff'; // Blue
    }
  }

  /**
   * Get risk level icon
   */
  getRiskLevelIcon(riskLevel) {
    switch (riskLevel) {
      case 'THẤP': return '✅';
      case 'TRUNG BÌNH': return '⚠️';
      case 'CAO': return '🚨';
      default: return 'ℹ️';
    }
  }

  // ===== CONSULTANT ACCESS METHODS =====
  
  /**
   * Get assessment results for a client (consultant view)
   */
  async getClientAssessmentResultsForConsultant(clientId) {
    try {
      const response = await api.get(`/assessments/consultant/client/${clientId}/results`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching client assessment results:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải kết quả đánh giá của khách hàng'
      };
    }
  }

  /**
   * Get latest assessment result for a client (consultant view)
   */
  async getLatestClientAssessmentForConsultant(clientId) {
    try {
      const response = await api.get(`/assessments/consultant/client/${clientId}/latest-result`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching latest client assessment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải kết quả đánh giá mới nhất'
      };
    }
  }
}

export default new AssessmentService(); 