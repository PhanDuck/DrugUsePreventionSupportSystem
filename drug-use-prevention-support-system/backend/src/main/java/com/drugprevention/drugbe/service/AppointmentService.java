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

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

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
        
        if (request.getDurationMinutes() == null || request.getDurationMinutes() <= 0) {
            throw new RuntimeException("Duration must be greater than 0");
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
        appointment.setFee(request.getFee() != null ? request.getFee() : BigDecimal.valueOf(100.0));
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
        
        // Check if time is at 15-minute intervals
        int minute = appointmentDate.getMinute();
        if (minute % 15 != 0) {
            throw new RuntimeException("Time must be in 15-minute intervals (00, 15, 30, 45)");
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

    public AppointmentDTO getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return convertToDTO(appointment);
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
        
        // Generate all possible time slots from 8:00 to 17:00 (last appointment at 5PM)
        List<String> allSlots = new ArrayList<>();
        for (int hour = 8; hour < 18; hour++) {
            for (int minute = 0; minute < 60; minute += 15) {
                if (hour == 17 && minute > 0) {
                    break; // Last appointment can start at 5:00 PM
                }
                allSlots.add(String.format("%02d:%02d", hour, minute));
            }
        }
        
        // Remove booked slots
        for (Appointment appointment : appointments) {
            if (appointment.getStatus().equals("CANCELLED")) {
                continue; // Skip cancelled appointments
            }
            
            LocalDateTime appointmentTime = appointment.getAppointmentDate();
            int durationMinutes = appointment.getDurationMinutes();
            
            // Remove all slots that overlap with this appointment
            for (int i = 0; i < durationMinutes; i += 15) {
                LocalDateTime slotTime = appointmentTime.plusMinutes(i);
                String slotString = String.format("%02d:%02d", slotTime.getHour(), slotTime.getMinute());
                allSlots.remove(slotString);
            }
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