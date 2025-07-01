package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by client ID
    List<Appointment> findByClientIdOrderByAppointmentDateDesc(Long clientId);

    // Find appointments by consultant ID
    List<Appointment> findByConsultantIdOrderByAppointmentDateDesc(Long consultantId);

    // Find appointments by status
    List<Appointment> findByStatusOrderByAppointmentDateAsc(String status);

    // Find appointments by client and status
    List<Appointment> findByClientIdAndStatusOrderByAppointmentDateDesc(Long clientId, String status);

    // Find appointments by consultant and status
    List<Appointment> findByConsultantIdAndStatusOrderByAppointmentDateDesc(Long consultantId, String status);

    // Find appointments in date range
    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateAsc(
            LocalDateTime startDate, LocalDateTime endDate);

    // Find upcoming appointments for a consultant
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.appointmentDate > :now AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByConsultant(
            @Param("consultantId") Long consultantId, 
            @Param("now") LocalDateTime now);

    // Find upcoming appointments for a client
    @Query("SELECT a FROM Appointment a WHERE a.clientId = :clientId " +
           "AND a.appointmentDate > :now AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByClient(
            @Param("clientId") Long clientId, 
            @Param("now") LocalDateTime now);

    // Check for conflicting appointments (same consultant, overlapping time)
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status IN ('PENDING', 'CONFIRMED') " +
           "AND a.appointmentDate < :endTime " +
           "AND DATEADD(minute, a.durationMinutes, a.appointmentDate) > :startTime")
    List<Appointment> findConflictingAppointments(
            @Param("consultantId") Long consultantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    // Find appointments that need payment reminder
    @Query("SELECT a FROM Appointment a WHERE a.paymentStatus = 'UNPAID' " +
           "AND a.status = 'CONFIRMED' AND a.appointmentDate < :reminderTime")
    List<Appointment> findAppointmentsNeedingPaymentReminder(@Param("reminderTime") LocalDateTime reminderTime);

    // Statistics queries
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status = 'COMPLETED' " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate")
    Long countCompletedAppointmentsByConsultant(
            @Param("consultantId") Long consultantId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status = 'COMPLETED' AND a.paymentStatus = 'PAID' " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate")
    Double calculateTotalEarningsByConsultant(
            @Param("consultantId") Long consultantId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Find available time slots for a consultant on a specific date
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND DATE(a.appointmentDate) = DATE(:date) " +
           "AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findConsultantAppointmentsByDate(
            @Param("consultantId") Long consultantId,
            @Param("date") LocalDateTime date);

    // Find appointments that can be auto-completed (past appointments still in CONFIRMED status)
    @Query("SELECT a FROM Appointment a WHERE a.status = 'CONFIRMED' " +
           "AND DATEADD(minute, a.durationMinutes, a.appointmentDate) < :now")
    List<Appointment> findAppointmentsToAutoComplete(@Param("now") LocalDateTime now);
} 