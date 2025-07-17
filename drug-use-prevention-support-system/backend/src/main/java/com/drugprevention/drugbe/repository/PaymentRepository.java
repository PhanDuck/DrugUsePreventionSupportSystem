package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByAppointmentId(Long appointmentId);
    Payment findByTransactionId(String transactionId);
} 