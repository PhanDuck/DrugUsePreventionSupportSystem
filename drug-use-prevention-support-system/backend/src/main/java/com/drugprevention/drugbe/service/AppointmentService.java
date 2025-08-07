package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.AppointmentDTO;
import com.drugprevention.drugbe.dto.CreateAppointmentRequest;
import com.drugprevention.drugbe.dto.RescheduleRequest;
import com.drugprevention.drugbe.entity.Appointment;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.AppointmentRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;
import com.drugprevention.drugbe.service.VnPayService;
import com.drugprevention.drugbe.service.PaymentService;
import com.drugprevention.drugbe.entity.Payment;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VnPayService vnPayService;

    @Autowired
    private PaymentService paymentService;

    // ===== CREATE APPOINTMENT WITH PAYMENT =====
    
    public Map<String, Object> createAppointmentWithPayment(CreateAppointmentRequest request) {
        try {
            // First create the appointment
            AppointmentDTO appointment = createAppointment(request);
            
            // Then create payment for the appointment
            Map<String, Object> paymentResult = createPaymentForAppointment(appointment);
            
            // Return combined result
            Map<String, Object> result = new HashMap<>();
            result.put("appointment", appointment);
            result.put("payment", paymentResult);
            result.put("success", true);
            
            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    private Map<String, Object> createPaymentForAppointment(AppointmentDTO appointment) {
        try {
            // Create payment entity
            Payment payment = new Payment();
            payment.setAppointment(new Appointment());
            payment.getAppointment().setId(appointment.getId());
            payment.setUser(new User());
            payment.getUser().setId(appointment.getClientId());
            payment.setAmount(appointment.getFee());
            payment.setCurrency("VND");
            payment.setPaymentMethod("VNPAY");
            payment.setStatus("PENDING");
            payment.setDescription("Payment for appointment with " + appointment.getConsultantName() + 
                                 " on " + appointment.getAppointmentDate().toLocalDate());
            payment.setCreatedAt(LocalDateTime.now());
            
            payment = paymentService.createPayment(payment);

            // Create VNPay parameters
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Amount", String.valueOf((long)(appointment.getFee().doubleValue() * 100)));
            vnpParams.put("vnp_OrderInfo", "Appointment payment - ID: " + appointment.getId());
            vnpParams.put("vnp_OrderType", "appointment");
            vnpParams.put("vnp_TxnRef", payment.getId().toString());

            String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
            payment.setPaymentUrl(paymentUrl);
            paymentService.createPayment(payment);

            Map<String, Object> paymentResult = new HashMap<>();
            paymentResult.put("paymentId", payment.getId());
            paymentResult.put("paymentUrl", paymentUrl);
            paymentResult.put("status", payment.getStatus());
            
            return paymentResult;
        } catch (Exception e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("error", "Failed to create payment: " + e.getMessage());
            return errorResult;
        }
    }

    // ===== CREATE APPOINTMENT =====
    
    public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
        // Validate request
        if (request == null) {
            throw new RuntimeException("Request cannot be null");
        }
        
        if (request.getClientId() == null) {
            throw new RuntimeException("Client ID cannot be null");
        }
        
        if (request.getConsultantId() == null) {
            throw new RuntimeException("Consultant ID cannot be null");
        }
        
        if (request.getAppointmentDate() == null) {
            throw new RuntimeException("Appointment date cannot be null");
        }
        
        // Validate and enforce 60-minute duration
        if (request.getDurationMinutes() == null) {
            request.setDurationMinutes(60); // Default to 60 minutes
        } else if (!request.getDurationMinutes().equals(60)) {
            throw new RuntimeException("All appointments must be exactly 60 minutes (1 hour)");
        }
        
        // Validate appointment date/time
        validateAppointmentDateTime(request.getAppointmentDate());
        
        // Validate client and consultant exist
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        User consultant = userRepository.findById(request.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        // Check if consultant has CONSULTANT role
        if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // Check if client and consultant are different
        if (request.getClientId().equals(request.getConsultantId())) {
            throw new RuntimeException("Client and consultant cannot be the same person");
        }

        // Check for scheduling conflicts
        LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                request.getConsultantId(), request.getAppointmentDate(), endTime);
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Consultant already has an appointment during this time");
        }

        // Create new appointment
        Appointment appointment = new Appointment();
        appointment.setClientId(request.getClientId());
        appointment.setConsultantId(request.getConsultantId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setAppointmentType(request.getAppointmentType() != null ? request.getAppointmentType() : "ONLINE");
        appointment.setClientNotes(request.getClientNotes());
        
        // Use consultant's consultation fee if not provided in request
        BigDecimal fee = request.getFee();
        if (fee == null) {
            fee = consultant.getConsultationFee();
            if (fee == null) {
                fee = BigDecimal.valueOf(100000.0); // Default fallback (VND)
            }
        }
        appointment.setFee(fee);
        
        appointment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "VNPAY");
        appointment.setStatus("PENDING");

        appointment = appointmentRepository.save(appointment);
        
        return convertToDTO(appointment);
    }
    
    // Validate appointment date and time
    private void validateAppointmentDateTime(LocalDateTime appointmentDate) {
        // Check if date is in the past
        if (appointmentDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot schedule appointments in the past");
        }
        
        // Check if date is too far in the future (max 30 days)
        if (appointmentDate.isAfter(LocalDateTime.now().plusDays(30))) {
            throw new RuntimeException("Can only schedule appointments within 30 days");
        }
        
        // Check if it's weekend
        DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Cannot schedule appointments on weekends");
        }
        
        // Check working hours (8 AM - 6 PM)
        int hour = appointmentDate.getHour();
        if (hour < 8 || hour >= 18) {
            throw new RuntimeException("Working hours are from 8:00 AM to 6:00 PM");
        }
        
        // Check if time is exactly on the hour (for 1-hour slots)
        int minute = appointmentDate.getMinute();
        if (minute != 0) {
            throw new RuntimeException("Appointments must start exactly on the hour (e.g., 08:00, 09:00, 10:00)");
        }
    }

    // ===== GET APPOINTMENTS =====
    
    public List<AppointmentDTO> getAppointmentsByClient(Long clientId) {
        List<Appointment> appointments = appointmentRepository.findByClientIdOrderByAppointmentDateDesc(clientId);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByConsultant(Long consultantId) {
        List<Appointment> appointments = appointmentRepository.findByConsultantIdOrderByAppointmentDateDesc(consultantId);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getUpcomingAppointmentsByClient(Long clientId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByClient(clientId, LocalDateTime.now());
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getUpcomingAppointmentsByConsultant(Long consultantId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByConsultant(consultantId, LocalDateTime.now());
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getConsultantAppointmentsByDate(Long consultantId, LocalDateTime date) {
        List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return convertToDTO(appointment);
    }

    public Optional<Appointment> getAppointmentEntityById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    // ===== UPDATE APPOINTMENT =====
    
    public AppointmentDTO confirmAppointment(Long appointmentId, Long consultantId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to confirm this appointment");
        }
        
        if (!"PENDING".equals(appointment.getStatus())) {
            throw new RuntimeException("Can only confirm pending appointments");
        }

        appointment.setStatus("CONFIRMED");
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO cancelAppointment(Long appointmentId, Long userId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check if user has permission to cancel
        if (!appointment.getClientId().equals(userId) && !appointment.getConsultantId().equals(userId)) {
            throw new RuntimeException("You do not have permission to cancel this appointment");
        }

        if ("CANCELLED".equals(appointment.getStatus()) || "COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Cannot cancel this appointment");
        }

        appointment.cancel(userId, reason);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO completeAppointment(Long appointmentId, Long consultantId, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to complete this appointment");
        }

        if (!"CONFIRMED".equals(appointment.getStatus())) {
            throw new RuntimeException("Can only complete confirmed appointments");
        }

        appointment.setStatus("COMPLETED");
        appointment.setConsultantNotes(notes);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO markAppointmentAsPaid(Long appointmentId, Long consultantId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to update payment status");
        }

        if ("PAID".equals(appointment.getPaymentStatus())) {
            throw new RuntimeException("Appointment is already marked as paid");
        }

        appointment.setPaymentStatus("PAID");
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO addMeetingLink(Long appointmentId, Long consultantId, String meetingLink) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to add meeting link");
        }

        appointment.setMeetingLink(meetingLink);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO updateMeetingLink(Long appointmentId, Long consultantId, String newMeetingLink) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to update meeting link for this appointment");
        }
        
        if (!"ONLINE".equals(appointment.getAppointmentType())) {
            throw new RuntimeException("Meeting link can only be updated for online appointments");
        }

        if (appointment.getMeetingLink() == null || appointment.getMeetingLink().trim().isEmpty()) {
            throw new RuntimeException("No existing meeting link to update");
        }

        appointment.setMeetingLink(newMeetingLink);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO removeMeetingLink(Long appointmentId, Long consultantId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to remove meeting link from this appointment");
        }
        
        if (!"ONLINE".equals(appointment.getAppointmentType())) {
            throw new RuntimeException("Meeting link can only be removed from online appointments");
        }

        if (appointment.getMeetingLink() == null || appointment.getMeetingLink().trim().isEmpty()) {
            throw new RuntimeException("No meeting link to remove");
        }

        appointment.setMeetingLink(null);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO setInPersonLocation(Long appointmentId, Long consultantId, String location, String room, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("You do not have permission to set location for this appointment");
        }
        
        if (!"IN_PERSON".equals(appointment.getAppointmentType())) {
            throw new RuntimeException("Location can only be set for in-person appointments");
        }

        // Combine location details into meetingLink field for in-person appointments
        StringBuilder locationDetails = new StringBuilder();
        locationDetails.append("Location: ").append(location);
        
        if (room != null && !room.trim().isEmpty()) {
            locationDetails.append(" | Room: ").append(room);
        }
        
        if (notes != null && !notes.trim().isEmpty()) {
            locationDetails.append(" | Notes: ").append(notes);
        }

        appointment.setMeetingLink(locationDetails.toString());
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public java.util.Map<String, Object> getMeetingInfo(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        java.util.Map<String, Object> meetingInfo = new java.util.HashMap<>();
        meetingInfo.put("appointmentId", appointmentId);
        meetingInfo.put("appointmentType", appointment.getAppointmentType());
        meetingInfo.put("appointmentDate", appointment.getAppointmentDate());
        meetingInfo.put("status", appointment.getStatus());
        
        if ("ONLINE".equals(appointment.getAppointmentType())) {
            meetingInfo.put("meetingLink", appointment.getMeetingLink());
            meetingInfo.put("type", "online");
        } else if ("IN_PERSON".equals(appointment.getAppointmentType())) {
            meetingInfo.put("location", appointment.getMeetingLink());
            meetingInfo.put("type", "in-person");
        }

        return meetingInfo;
    }

    // ===== ADMIN FUNCTIONS =====
    
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByStatus(String status) {
        List<Appointment> appointments = appointmentRepository.findByStatusOrderByAppointmentDateAsc(status);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===== UTILITY METHODS =====
    
    private AppointmentDTO convertToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setClientId(appointment.getClientId());
        dto.setConsultantId(appointment.getConsultantId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setDurationMinutes(appointment.getDurationMinutes());
        dto.setStatus(appointment.getStatus());
        dto.setAppointmentType(appointment.getAppointmentType());
        dto.setClientNotes(appointment.getClientNotes());
        dto.setConsultantNotes(appointment.getConsultantNotes());
        dto.setMeetingLink(appointment.getMeetingLink());
        dto.setFee(appointment.getFee());
        dto.setPaymentStatus(appointment.getPaymentStatus());
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        dto.setCancelledAt(appointment.getCancelledAt());
        dto.setCancellationReason(appointment.getCancellationReason());
        
        // Payment fields
        dto.setVnpayTxnRef(appointment.getVnpayTxnRef());
        dto.setVnpayResponseCode(appointment.getVnpayResponseCode());
        dto.setVnpayTransactionNo(appointment.getVnpayTransactionNo());
        dto.setVnpayBankCode(appointment.getVnpayBankCode());
        dto.setPaymentUrl(appointment.getPaymentUrl());
        dto.setPaidAt(appointment.getPaidAt());
        dto.setPaymentMethod(appointment.getPaymentMethod());

        // Load user information
        Optional<User> client = userRepository.findById(appointment.getClientId());
        if (client.isPresent()) {
            User clientUser = client.get();
            String firstName = clientUser.getFirstName() != null ? clientUser.getFirstName() : "";
            String lastName = clientUser.getLastName() != null ? clientUser.getLastName() : "";
            dto.setClientName(firstName + " " + lastName);
            dto.setClientEmail(clientUser.getEmail());
            dto.setClientPhone(clientUser.getPhone());
        } else {
            dto.setClientName("Unknown Client");
            dto.setClientEmail("");
            dto.setClientPhone("");
        }

        Optional<User> consultant = userRepository.findById(appointment.getConsultantId());
        if (consultant.isPresent()) {
            User consultantUser = consultant.get();
            String firstName = consultantUser.getFirstName() != null ? consultantUser.getFirstName() : "";
            String lastName = consultantUser.getLastName() != null ? consultantUser.getLastName() : "";
            dto.setConsultantName(firstName + " " + lastName);
            dto.setConsultantEmail(consultantUser.getEmail());
            dto.setConsultantExpertise(consultantUser.getExpertise());
        } else {
            dto.setConsultantName("Unknown Consultant");
            dto.setConsultantEmail("");
            dto.setConsultantExpertise("");
        }

        return dto;
    }

    // ===== STATISTICS =====
    
    public Long getCompletedAppointmentsCount(Long consultantId, LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.countCompletedAppointmentsByConsultant(consultantId, startDate, endDate);
    }

    public Double getTotalEarnings(Long consultantId, LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.calculateTotalEarningsByConsultant(consultantId, startDate, endDate);
    }
    
    // ===== AVAILABLE TIME SLOTS =====
    
    public List<String> getAvailableTimeSlots(Long consultantId, LocalDateTime date) {
        // Validate consultant exists
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
                
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // Validate date
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        if (startOfDay.isBefore(LocalDateTime.now().toLocalDate().atStartOfDay())) {
            throw new RuntimeException("Cannot view appointments in the past");
        }
        
        // Check if it's weekend
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return List.of(); // Return empty list for weekends
        }
        
        // Get all appointments for this consultant on this date
        List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
        
        // Generate all possible 1-hour time slots from 8:00 to 17:00 (skip lunch 12:00-13:00)
        List<String> allSlots = new ArrayList<>();
        int[] workingHours = {8, 9, 10, 11, 13, 14, 15, 16, 17}; // Skip 12:00-13:00 lunch break
        
        for (int hour : workingHours) {
            allSlots.add(String.format("%02d:00", hour));
        }
        
        // Remove booked slots (1-hour appointments)
        for (Appointment appointment : appointments) {
            if (appointment.getStatus().equals("CANCELLED")) {
                continue; // Skip cancelled appointments
            }
            
            LocalDateTime appointmentTime = appointment.getAppointmentDate();
            // For 1-hour appointments, just remove the exact hour slot
            String bookedSlot = String.format("%02d:00", appointmentTime.getHour());
            allSlots.remove(bookedSlot);
        }
        
        // For today, remove past time slots
        if (date.toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
            LocalDateTime now = LocalDateTime.now();
            allSlots.removeIf(slot -> {
                String[] parts = slot.split(":");
                int slotHour = Integer.parseInt(parts[0]);
                int slotMinute = Integer.parseInt(parts[1]);
                return slotHour < now.getHour() || (slotHour == now.getHour() && slotMinute <= now.getMinute());
            });
        }
        
        return allSlots;
    }

    // ===== NEW METHODS FOR CONSULTANT BOOKING =====
    
    public List<Map<String, Object>> getAvailableTimeSlotsForDate(Long consultantId, LocalDate date) {
        // Validate consultant exists
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
                
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // Validate date
        if (date.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot view appointments in the past");
        }
        
        // Check if it's weekend
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return List.of(); // Return empty list for weekends
        }
        
        // Get all appointments for this consultant on this date
        LocalDateTime startOfDay = date.atStartOfDay();
        List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, startOfDay);
        
        // Generate all possible 1-hour time slots from 8:00 to 17:00 (skip lunch)
        List<Map<String, Object>> availableSlots = new ArrayList<>();
        int[] workingHours = {8, 9, 10, 11, 13, 14, 15, 16, 17}; // Skip 12:00-13:00 lunch break
        
        for (int hour : workingHours) {
            LocalDateTime slotTime = date.atTime(hour, 0);
            
            // Check if slot is available (not booked)
            boolean isAvailable = true;
            for (Appointment appointment : appointments) {
                if (appointment.getStatus().equals("CANCELLED")) {
                    continue; // Skip cancelled appointments
                }
                
                LocalDateTime appointmentTime = appointment.getAppointmentDate();
                
                // For 1-hour appointments, check if exact hour matches
                if (appointmentTime.getHour() == hour) {
                    isAvailable = false;
                    break;
                }
            }
            
            // For today, check if slot is in the past
            if (date.equals(LocalDate.now()) && slotTime.isBefore(LocalDateTime.now())) {
                isAvailable = false;
            }
            
            if (isAvailable) {
                Map<String, Object> slot = new HashMap<>();
                slot.put("time", String.format("%02d:00", hour));
                slot.put("available", true);
                slot.put("duration", 60); // Fixed 60 minutes
                slot.put("fee", 100.0); // Default fee
                availableSlots.add(slot);
            }
        }
        
        return availableSlots;
    }
    
    public List<Map<String, Object>> getConsultantScheduleForDateRange(Long consultantId, LocalDate startDate, LocalDate endDate) {
        // Validate consultant exists
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
                
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Start date cannot be after end date");
        }
        
        // Get appointments for the date range
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<Appointment> appointments = appointmentRepository.findByConsultantIdAndDateRange(
                consultantId, startDateTime, endDateTime);
        
        List<Map<String, Object>> schedule = new ArrayList<>();
        for (Appointment appointment : appointments) {
            Map<String, Object> appointmentInfo = new HashMap<>();
            appointmentInfo.put("appointmentId", appointment.getId());
            appointmentInfo.put("date", appointment.getAppointmentDate().toLocalDate().toString());
            appointmentInfo.put("time", appointment.getAppointmentDate().toLocalTime().toString());
            appointmentInfo.put("duration", appointment.getDurationMinutes());
            appointmentInfo.put("status", appointment.getStatus());
            appointmentInfo.put("appointmentType", appointment.getAppointmentType());
            appointmentInfo.put("fee", appointment.getFee());
            appointmentInfo.put("clientId", appointment.getClientId());
            
            // Get client name
            Optional<User> client = userRepository.findById(appointment.getClientId());
            if (client.isPresent()) {
                User clientUser = client.get();
                String firstName = clientUser.getFirstName() != null ? clientUser.getFirstName() : "";
                String lastName = clientUser.getLastName() != null ? clientUser.getLastName() : "";
                appointmentInfo.put("clientName", firstName + " " + lastName);
            } else {
                appointmentInfo.put("clientName", "Unknown Client");
            }
            
            schedule.add(appointmentInfo);
        }
        
        return schedule;
    }

    // ===== RESCHEDULE APPOINTMENT =====
    
    public AppointmentDTO rescheduleAppointment(Long appointmentId, RescheduleRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check if appointment can be rescheduled
        if ("CANCELLED".equals(appointment.getStatus()) || "COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Cannot reschedule appointments that have been cancelled or completed");
        }

        // Validate new appointment date/time
        validateAppointmentDateTime(request.getNewDateTime());

        // Check for conflicts with new time
        LocalDateTime endTime = request.getNewDateTime().plusMinutes(appointment.getDurationMinutes());
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                appointment.getConsultantId(), request.getNewDateTime(), endTime);
        
        // Remove current appointment from conflicts list
        conflicts = conflicts.stream()
                .filter(a -> !a.getId().equals(appointmentId))
                .collect(Collectors.toList());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Consultant already has an appointment during this time");
        }

        // Update appointment
        appointment.setAppointmentDate(request.getNewDateTime());
        appointment.setStatus("RESCHEDULED");
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    // ===== APPOINTMENT STATISTICS =====
    
    public AppointmentStatistics getAppointmentStatistics(Long userId, String period) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();
        
        switch (period.toLowerCase()) {
            case "week":
                startDate = endDate.minusWeeks(1);
                break;
            case "month":
                startDate = endDate.minusMonths(1);
                break;
            case "year":
                startDate = endDate.minusYears(1);
                break;
            default:
                startDate = endDate.minusMonths(1); // Default to month
        }

        Long totalAppointments = appointmentRepository.countAppointmentsByClientAndPeriod(userId, startDate, endDate);
        Long completedAppointments = appointmentRepository.countCompletedAppointmentsByConsultant(userId, startDate, endDate);
        Double totalEarnings = appointmentRepository.calculateTotalEarningsByConsultant(userId, startDate, endDate);

        return new AppointmentStatistics(
            totalAppointments != null ? totalAppointments : 0L,
            completedAppointments != null ? completedAppointments : 0L,
            totalEarnings != null ? totalEarnings : 0.0
        );
    }

    // ===== AUTO COMPLETE PAST APPOINTMENTS =====
    
    public void autoCompletePastAppointments() {
        List<Appointment> appointmentsToComplete = appointmentRepository.findAppointmentsToAutoComplete(LocalDateTime.now());
        
        for (Appointment appointment : appointmentsToComplete) {
            appointment.setStatus("COMPLETED");
            appointmentRepository.save(appointment);
        }
    }

    // ===== SEND REMINDERS =====
    
    public void sendAppointmentReminders() {
        // Find appointments that need reminders (24 hours before)
        LocalDateTime reminderTime = LocalDateTime.now().plusHours(24);
        List<Appointment> appointmentsNeedingReminders = appointmentRepository.findAppointmentsNeedingPaymentReminder(reminderTime);
        
        // In a real implementation, you would send emails/SMS here
        for (Appointment appointment : appointmentsNeedingReminders) {
            // Send reminder logic here
            System.out.println("Sending reminder for appointment: " + appointment.getId());
        }
    }
    
    // ===== PENDING APPOINTMENTS =====
    
    public List<AppointmentDTO> getPendingAppointmentsByConsultant(Long consultantId) {
        List<Appointment> appointments = appointmentRepository.findByConsultantIdAndStatusOrderByAppointmentDateAsc(consultantId, "PENDING");
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update appointment status
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(newStatus);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(savedAppointment);
    }

    // ===== INNER CLASSES =====
    
    public static class AppointmentStatistics {
        private Long totalAppointments;
        private Long completedAppointments;
        private Double totalEarnings;

        public AppointmentStatistics(Long totalAppointments, Long completedAppointments, Double totalEarnings) {
            this.totalAppointments = totalAppointments;
            this.completedAppointments = completedAppointments;
            this.totalEarnings = totalEarnings;
        }

        public Long getTotalAppointments() {
            return totalAppointments;
        }

        public void setTotalAppointments(Long totalAppointments) {
            this.totalAppointments = totalAppointments;
        }

        public Long getCompletedAppointments() {
            return completedAppointments;
        }

        public void setCompletedAppointments(Long completedAppointments) {
            this.completedAppointments = completedAppointments;
        }

        public Double getTotalEarnings() {
            return totalEarnings;
        }

        public void setTotalEarnings(Double totalEarnings) {
            this.totalEarnings = totalEarnings;
        }
    }
} 