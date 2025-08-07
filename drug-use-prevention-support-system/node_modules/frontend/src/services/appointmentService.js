import api from '../config/axios';

class AppointmentService {
  
  // ===== CREATE APPOINTMENT =====
  async createAppointment(appointmentData) {
    try {
      // Check authentication first
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Please log in to book an appointment'
        };
      }

      // Prepare request data matching backend CreateAppointmentRequest DTO
      const requestData = {
        clientId: currentUser.id,
        consultantId: appointmentData.consultantId,
        appointmentDate: appointmentData.appointmentDate, // ISO string format
        durationMinutes: 60, // Fixed 1-hour duration
        appointmentType: appointmentData.appointmentType || 'ONLINE',
        clientNotes: appointmentData.clientNotes || '',
        fee: appointmentData.fee || 100.0
      };

      console.log('📤 Creating appointment:', requestData);
      const response = await api.post('/appointments', requestData);
      
      console.log('✅ Appointment created successfully:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Appointment booked successfully!'
      };
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Unable to create appointment';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ===== CREATE APPOINTMENT WITH PAYMENT (INTEGRATED) =====
  async createAppointmentWithPayment(appointmentData) {
    try {
      // Check authentication first
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Please log in to book an appointment'
        };
      }

      // Prepare request data matching backend CreateAppointmentRequest DTO
      const requestData = {
        clientId: currentUser.id,
        consultantId: appointmentData.consultantId,
        appointmentDate: appointmentData.appointmentDate, // ISO string format
        durationMinutes: 60, // Fixed 1-hour duration
        appointmentType: appointmentData.appointmentType || 'ONLINE',
        clientNotes: appointmentData.clientNotes || '',
        fee: appointmentData.fee || 100.0
      };

      console.log('📤 Creating appointment directly (no payment required):', requestData);
      
      // 🔄 SIMPLIFIED: Direct appointment creation without payment
      const response = await api.post('/appointments', requestData);
      
      console.log('✅ Appointment created successfully:', response.data);
      return {
        success: true,
        data: {
          appointment: response.data
        },
        message: 'Appointment booked successfully!'
      };
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Unable to create appointment';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ===== APPOINTMENT PAYMENT =====
  async createAppointmentPayment(appointmentId, amount, description) {
    try {
      console.log('💰 Creating appointment payment:', { appointmentId, amount, description });
      
      const requestData = {
        appointmentId: appointmentId,
        amount: amount,
        description: description,
        paymentMethod: 'VNPAY',
        returnUrl: `${window.location.origin}/payment/return`
      };

      const response = await api.post('/payments/appointment/create', requestData);
      
      console.log('✅ Appointment payment created:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Payment URL generated successfully!'
      };
    } catch (error) {
      console.error('❌ Error creating appointment payment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Unable to create payment';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ===== GET APPOINTMENTS BY CLIENT =====
  async getAppointmentsByClient(clientId) {
    try {
      // Check authentication
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Authentication required'
        };
      }

      const response = await api.get(`/appointments/client/${clientId || currentUser.id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to fetch appointments'
      };
    }
  }

  // ===== GET APPOINTMENTS BY CONSULTANT =====
  async getAppointmentsByConsultant(consultantId) {
    try {
      // Check authentication and role
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Authentication required'
        };
      }

      if (currentUser.role !== 'CONSULTANT' && consultantId !== currentUser.id) {
        return {
          success: false,
          message: 'Access denied. Consultant role required.'
        };
      }

      const response = await api.get(`/appointments/consultant/${consultantId || currentUser.id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultant appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to fetch appointments'
      };
    }
  }

  // ===== GET PENDING APPOINTMENTS FOR CONSULTANT =====
  async getPendingAppointments(consultantId) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.role !== 'CONSULTANT') {
        return {
          success: false,
          message: 'Access denied. Consultant role required.'
        };
      }

      const response = await api.get(`/appointments/pending?consultantId=${consultantId || currentUser.id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to fetch pending appointments'
      };
    }
  }

  // ===== CONFIRM APPOINTMENT =====
  async confirmAppointment(appointmentId, consultantId) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.role !== 'CONSULTANT') {
        return {
          success: false,
          message: 'Access denied. Consultant role required.'
        };
      }

      const response = await api.put(`/appointments/${appointmentId}/confirm`, null, {
        params: { consultantId: consultantId || currentUser.id }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to confirm appointment'
      };
    }
  }

  // ===== CANCEL APPOINTMENT =====
  async cancelAppointment(appointmentId, userId, reason) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Authentication required'
        };
      }

      const response = await api.put(`/appointments/${appointmentId}/cancel`, null, {
        params: { 
          userId: userId || currentUser.id,
          reason: reason || 'Cancelled by user'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to cancel appointment'
      };
    }
  }

  // ===== COMPLETE APPOINTMENT =====
  async completeAppointment(appointmentId, consultantId, notes = '') {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.role !== 'CONSULTANT') {
        return {
          success: false,
          message: 'Access denied. Consultant role required.'
        };
      }

      const response = await api.put(`/appointments/${appointmentId}/complete`, null, {
        params: { 
          consultantId: consultantId || currentUser.id,
          notes: notes
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error completing appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to complete appointment'
      };
    }
  }

  // ===== GET AVAILABLE SLOTS =====
  async getAvailableSlots(consultantId, date) {
    try {
      const response = await api.get(`/consultants/${consultantId}/available-slots?date=${date}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load available slots'
      };
    }
  }

  // ===== GENERATE TIME SLOTS WITH JS (1 HOUR INTERVALS) =====
  async getAvailableSlotsJS(consultantId, date) {
    try {
      console.log('🕐 Generating 1-hour time slots with JavaScript for:', { consultantId, date });
      
      // 1. First get existing appointments for this consultant and date
      const appointmentsResult = await this.getConsultantAppointmentsByDate(consultantId, date);
      let bookedSlots = [];
      
      if (appointmentsResult.success) {
        bookedSlots = appointmentsResult.data.map(appointment => {
          const appointmentDateTime = new Date(appointment.appointmentDate);
          return {
            time: this.formatTimeFromDate(appointmentDateTime),
            duration: 60 // Always 60 minutes
          };
        });
      }
      
      console.log('📅 Booked 1-hour slots found:', bookedSlots);
      
      // 2. Generate all possible 1-hour time slots
      const allSlots = this.generateAllHourlyTimeSlots(date);
      console.log('⏰ All possible 1-hour slots:', allSlots.length);
      
      // 3. Remove booked slots
      const availableSlots = this.filterAvailableHourlySlots(allSlots, bookedSlots);
      console.log('✅ Available 1-hour slots:', availableSlots.length);
      
      return {
        success: true,
        data: availableSlots
      };
    } catch (error) {
      console.error('Error generating 1-hour time slots:', error);
      return {
        success: false,
        message: 'Unable to generate time slots',
        data: []
      };
    }
  }

  // Helper: Get consultant appointments for specific date
  async getConsultantAppointmentsByDate(consultantId, date) {
    try {
      // Use public endpoint that doesn't require CONSULTANT role
      const response = await api.get(`/appointments/consultant/${consultantId}/booked-slots?date=${date}`);
      
      // Transform response to match expected format
      if (response.data && response.data.bookedSlots) {
        const appointments = response.data.bookedSlots.map(slot => ({
          appointmentDate: date + 'T' + slot.time,
          durationMinutes: slot.duration || 60
        }));
        
        return {
          success: true,
          data: appointments
        };
      }
      
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Error fetching consultant booked slots:', error);
      // Return empty if no appointments found (not an error)
      return {
        success: true,
        data: []
      };
    }
  }

  // Helper: Generate all possible 1-hour time slots for a date
  generateAllHourlyTimeSlots(date) {
    const slots = [];
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    
    console.log('📅 Generating 1-hour slots for date:', date);
    console.log('📅 Selected date object:', selectedDate);
    console.log('📅 Today:', today);
    
    // Skip if date is in the past
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      console.log('⏮️ Date is in the past, no slots available');
      return [];
    }
    
    // Check if it's weekend
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = Sunday, 6 = Saturday
      console.log('🏖️ Weekend day, no slots available');
      return [];
    }
    
    // Generate 1-hour slots from 8:00 AM to 5:00 PM (9 slots total)
    // 8:00-9:00, 9:00-10:00, 10:00-11:00, 11:00-12:00, 
    // 13:00-14:00, 14:00-15:00, 15:00-16:00, 16:00-17:00, 17:00-18:00
    const workingHours = [8, 9, 10, 11, 13, 14, 15, 16, 17]; // Skip 12:00-13:00 (lunch break)
    
    for (const hour of workingHours) {
      const slotDateTime = new Date(selectedDate);
      slotDateTime.setHours(hour, 0, 0, 0);
      
      // Skip slots that are in the past (for today)
      const now = new Date();
      if (selectedDate.toDateString() === now.toDateString() && slotDateTime <= now) {
        continue;
      }
      
      slots.push({
        time: this.formatTime24Hour(hour, 0),
        display: this.formatTime12Hour(hour, 0) + ' - ' + this.formatTime12Hour(hour + 1, 0),
        dateTime: slotDateTime.toISOString(),
        available: true, // Will be filtered later
        duration: 60,
        hourSlot: true
      });
    }
    
    console.log(`⏰ Generated ${slots.length} hourly time slots`);
    return slots;
  }

  // Helper: Filter out booked 1-hour slots
  filterAvailableHourlySlots(allSlots, bookedSlots) {
    return allSlots.filter(slot => {
      const slotTime = slot.time;
      
      // Check if this hour slot conflicts with any booked appointment
      const isBooked = bookedSlots.some(booked => {
        const bookedTime = booked.time;
        
        // For 1-hour slots, check if the booked time falls within this hour
        // Convert times to minutes for easier comparison
        const slotStartMinutes = this.timeStringToMinutes(slotTime);
        const slotEndMinutes = slotStartMinutes + 60; // 1 hour slot
        const bookedMinutes = this.timeStringToMinutes(bookedTime);
        const bookedEndMinutes = bookedMinutes + 60; // Always 60 minutes
        
        // Check for any overlap
        return (bookedMinutes < slotEndMinutes && bookedEndMinutes > slotStartMinutes);
      });
      
      return !isBooked;
    });
  }

  // Helper: Check if time slots overlap (updated for 1-hour slots)
  timeSlotsOverlap(newSlotTime, bookedStartTime, bookedEndTime) {
    const newSlotMinutes = this.timeStringToMinutes(newSlotTime);
    const bookedStartMinutes = this.timeStringToMinutes(bookedStartTime);
    const bookedEndMinutes = this.timeStringToMinutes(bookedEndTime);
    
    // 1-hour appointment duration for new slot
    const newSlotEndMinutes = newSlotMinutes + 60;
    
    // Check overlap: new slot starts before booked ends AND new slot ends after booked starts
    return (newSlotMinutes < bookedEndMinutes && newSlotEndMinutes > bookedStartMinutes);
  }

  // Helper: Convert time string to minutes since midnight
  timeStringToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper: Format time in 24-hour format
  formatTime24Hour(hour, minute) {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  // Helper: Format time in 12-hour format
  formatTime12Hour(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  // Helper: Format time from Date object
  formatTimeFromDate(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return this.formatTime24Hour(hour, minute);
  }

  // ===== TEST METHOD FOR 1-HOUR SLOT VERIFICATION =====
  testHourlySlotGeneration(date = '2025-07-18') {
    console.log('🧪 Testing 1-hour slot generation for:', date);
    
    // Test all slots generation
    const allSlots = this.generateAllHourlyTimeSlots(date);
    console.log('📊 Generated slots:', allSlots);
    
    // Test with mock booked appointments
    const mockBookedSlots = [
      { time: '09:00', duration: 60 }, // 9:00-10:00 booked
      { time: '14:00', duration: 60 }  // 2:00-3:00 PM booked
    ];
    
    const availableSlots = this.filterAvailableHourlySlots(allSlots, mockBookedSlots);
    console.log('✅ Available slots after filtering:', availableSlots);
    
    // Expected: Should show 7 available slots (9 total - 2 booked = 7)
    const expected = ['08:00', '10:00', '11:00', '13:00', '15:00', '16:00', '17:00'];
    const actual = availableSlots.map(slot => slot.time);
    
    console.log('🎯 Expected available times:', expected);
    console.log('🎯 Actual available times:', actual);
    console.log('✅ Test passed:', JSON.stringify(expected) === JSON.stringify(actual));
    
    return {
      total: allSlots.length,
      booked: mockBookedSlots.length,
      available: availableSlots.length,
      expectedTimes: expected,
      actualTimes: actual,
      testPassed: JSON.stringify(expected) === JSON.stringify(actual)
    };
  }

  // ===== RESCHEDULE APPOINTMENT =====
  async rescheduleAppointment(appointmentId, rescheduleData) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/reschedule`, rescheduleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to reschedule appointment'
      };
    }
  }

  // ===== MEETING LINK MANAGEMENT =====
  async addMeetingLink(appointmentId, consultantId, meetingLink) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/meeting-link`, null, {
        params: {
          consultantId: consultantId,
          meetingLink: meetingLink
        }
      });
      return {
        success: true,
        data: response.data,
        message: 'Meeting link added successfully'
      };
    } catch (error) {
      console.error('Error adding meeting link:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to add meeting link'
      };
    }
  }

  async updateMeetingLink(appointmentId, consultantId, newMeetingLink) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/update-meeting-link`, null, {
        params: {
          consultantId: consultantId,
          newMeetingLink: newMeetingLink
        }
      });
      return {
        success: true,
        data: response.data,
        message: 'Meeting link updated successfully'
      };
    } catch (error) {
      console.error('Error updating meeting link:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update meeting link'
      };
    }
  }

  async removeMeetingLink(appointmentId, consultantId) {
    try {
      const response = await api.delete(`/appointments/${appointmentId}/meeting-link`, {
        params: {
          consultantId: consultantId
        }
      });
      return {
        success: true,
        data: response.data,
        message: 'Meeting link removed successfully'
      };
    } catch (error) {
      console.error('Error removing meeting link:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to remove meeting link'
      };
    }
  }

  async generateMeetingLink(appointmentId) {
    try {
      const response = await api.post(`/appointments/${appointmentId}/generate-meeting-link`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error generating meeting link:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to generate meeting link'
      };
    }
  }

  async getMeetingInfo(appointmentId) {
    try {
      const response = await api.get(`/appointments/${appointmentId}/meeting-info`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting meeting info:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to get meeting information'
      };
    }
  }

  // ===== STATISTICS =====
  async getAppointmentStatistics(userId, period = 'month') {
    try {
      const response = await api.get(`/appointments/statistics/${userId}?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load statistics'
      };
    }
  }

  // ===== ADMIN FUNCTIONS =====
  async getAllAppointments() {
    try {
      const response = await api.get('/appointments/admin/all');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load all appointments'
      };
    }
  }

  async getAppointmentsByStatus(status) {
    try {
      const response = await api.get(`/appointments/admin/status/${status}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load appointments by status'
      };
    }
  }

  // ===== UTILITY METHODS =====
  formatAppointmentDateTime(date, time) {
    // Combine date and time into ISO string format for backend
    const dateStr = date.format('YYYY-MM-DD');
    const timeStr = time.format('HH:mm:ss');
    return `${dateStr}T${timeStr}`;
  }

  getStatusDisplayText(status) {
    const statusMap = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'RESCHEDULED': 'Rescheduled'
    };
    return statusMap[status] || status;
  }

  getPaymentStatusDisplayText(paymentStatus) {
    const statusMap = {
      'UNPAID': 'Unpaid',
      'PAID': 'Paid',
      'REFUNDED': 'Refunded'
    };
    return statusMap[paymentStatus] || paymentStatus;
  }

  getAppointmentTypeDisplayText(appointmentType) {
    const typeMap = {
      'ONLINE': 'Online',
      'IN_PERSON': 'In-person'
    };
    return typeMap[appointmentType] || appointmentType;
  }

  // ===== VALIDATION HELPERS =====
  validateAppointmentData(appointmentData) {
    const errors = [];

    if (!appointmentData.clientId) {
      errors.push('Client ID is required');
    }

    if (!appointmentData.consultantId) {
      errors.push('Consultant ID is required');
    }

    if (!appointmentData.appointmentDate) {
      errors.push('Appointment date is required');
    }

    if (!appointmentData.durationMinutes || appointmentData.durationMinutes < 15) {
      errors.push('Duration must be at least 15 minutes');
    }

    if (!['ONLINE', 'IN_PERSON'].includes(appointmentData.appointmentType)) {
      errors.push('Invalid appointment type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== HELPER METHODS =====
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // ===== GET CURRENT USER APPOINTMENTS =====
  async getCurrentUserAppointments() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Please log in to view appointments'
        };
      }

      // Use appropriate endpoint based on user role
      if (currentUser.role === 'CONSULTANT') {
        return await this.getAppointmentsByConsultant(currentUser.id);
      } else {
        return await this.getAppointmentsByClient(currentUser.id);
      }
    } catch (error) {
      console.error('Error fetching current user appointments:', error);
      return {
        success: false,
        message: 'Unable to fetch appointments'
      };
    }
  }

  // ===== UPDATE APPOINTMENT STATUS =====
  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      return {
        success: true,
        data: response.data,
        message: 'Appointment status updated successfully'
      };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to update appointment status'
      };
    }
  }
}

export default new AppointmentService(); 