package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Payment;
import com.drugprevention.drugbe.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getPaymentsByAppointment(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId);
    }

    public Payment updatePaymentStatus(Long paymentId, String status) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(status);
            return paymentRepository.save(payment);
        }
        return null;
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }
} 