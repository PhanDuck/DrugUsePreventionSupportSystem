package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.AppointmentDTO;
import com.drugprevention.drugbe.dto.CreateAppointmentRequest;
import com.drugprevention.drugbe.entity.Appointment;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.AppointmentRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.DayOfWeek;
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
        // Validate appointment date/time
        validateAppointmentDateTime(request.getAppointmentDate());
        
        // Validate client and consultant exist
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        User consultant = userRepository.findById(request.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên"));

        // Check if consultant has CONSULTANT role
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Người được chọn không phải là tư vấn viên");
        }

        // Check for scheduling conflicts
        LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                request.getConsultantId(), request.getAppointmentDate(), endTime);
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Tư vấn viên đã có lịch hẹn trong thời gian này");
        }

        // Create new appointment
        Appointment appointment = new Appointment();
        appointment.setClientId(request.getClientId());
        appointment.setConsultantId(request.getConsultantId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setClientNotes(request.getClientNotes());
        appointment.setFee(request.getFee());
        appointment.setPaymentMethod(request.getPaymentMethod());
        appointment.setStatus("PENDING");

        appointment = appointmentRepository.save(appointment);
        
        return convertToDTO(appointment);
    }
    
    // Validate appointment date and time
    private void validateAppointmentDateTime(LocalDateTime appointmentDate) {
        // Check if date is in the past
        if (appointmentDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Không thể đặt lịch trong quá khứ");
        }
        
        // Check if date is too far in the future (max 30 days)
        if (appointmentDate.isAfter(LocalDateTime.now().plusDays(30))) {
            throw new RuntimeException("Chỉ có thể đặt lịch trong vòng 30 ngày tới");
        }
        
        // Check if it's weekend
        DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Không thể đặt lịch vào cuối tuần");
        }
        
        // Check working hours (8 AM - 6 PM)
        int hour = appointmentDate.getHour();
        if (hour < 8 || hour >= 18) {
            throw new RuntimeException("Giờ làm việc từ 8:00 sáng đến 6:00 chiều");
        }
        
        // Check if time is at 15-minute intervals
        int minute = appointmentDate.getMinute();
        if (minute % 15 != 0) {
            throw new RuntimeException("Thời gian phải là bội số của 15 phút (00, 15, 30, 45)");
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        return convertToDTO(appointment);
    }

    // ===== UPDATE APPOINTMENT =====
    
    public AppointmentDTO confirmAppointment(Long appointmentId, Long consultantId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền xác nhận lịch hẹn này");
        }
        
        if (!"PENDING".equals(appointment.getStatus())) {
            throw new RuntimeException("Chỉ có thể xác nhận lịch hẹn đang chờ");
        }

        appointment.setStatus("CONFIRMED");
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO cancelAppointment(Long appointmentId, Long userId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        // Check if user has permission to cancel
        if (!appointment.getClientId().equals(userId) && !appointment.getConsultantId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy lịch hẹn này");
        }

        if ("CANCELLED".equals(appointment.getStatus()) || "COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Không thể hủy lịch hẹn này");
        }

        appointment.cancel(userId, reason);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO completeAppointment(Long appointmentId, Long consultantId, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền hoàn thành lịch hẹn này");
        }

        if (!"CONFIRMED".equals(appointment.getStatus())) {
            throw new RuntimeException("Chỉ có thể hoàn thành lịch hẹn đã xác nhận");
        }

        appointment.setStatus("COMPLETED");
        appointment.setConsultantNotes(notes);
        appointment = appointmentRepository.save(appointment);

        return convertToDTO(appointment);
    }

    public AppointmentDTO addMeetingLink(Long appointmentId, Long consultantId, String meetingLink) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        if (!appointment.getConsultantId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền thêm link meeting");
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
            dto.setClientName(clientUser.getFirstName() + " " + clientUser.getLastName());
            dto.setClientEmail(clientUser.getEmail());
            dto.setClientPhone(clientUser.getPhone());
        }

        Optional<User> consultant = userRepository.findById(appointment.getConsultantId());
        if (consultant.isPresent()) {
            User consultantUser = consultant.get();
            dto.setConsultantName(consultantUser.getFirstName() + " " + consultantUser.getLastName());
            dto.setConsultantEmail(consultantUser.getEmail());
            dto.setConsultantExpertise(consultantUser.getExpertise());
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên"));
                
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Người được chọn không phải là tư vấn viên");
        }
        
        // Validate date
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        if (startOfDay.isBefore(LocalDateTime.now().toLocalDate().atStartOfDay())) {
            throw new RuntimeException("Không thể xem lịch trong quá khứ");
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
} 