package com.drugprevention.drugbe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
@Tag(name = "Payment Controller", description = "APIs for payment management")
public class PaymentController {

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Create payment", description = "Create a new payment for appointment")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> request) {
        try {
            Long appointmentId = Long.valueOf(request.get("appointmentId").toString());
            Double amount = Double.valueOf(request.get("amount").toString());
            String paymentMethod = request.get("paymentMethod").toString();
            
            // Mock payment creation
            Map<String, Object> payment = Map.of(
                "id", 1,
                "appointmentId", appointmentId,
                "amount", amount,
                "currency", "VND",
                "paymentMethod", paymentMethod,
                "status", "PENDING",
                "paymentUrl", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?token=abc123",
                "createdAt", "2024-01-10T10:30:00Z"
            );
            
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating payment: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get payment details", description = "Get payment information by ID")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            // Mock payment details
            Map<String, Object> payment = Map.of(
                "id", id,
                "appointmentId", 1,
                "amount", 800000.0,
                "currency", "VND",
                "paymentMethod", "VNPAY",
                "status", "SUCCESS",
                "transactionId", "VNPAY123456",
                "paymentTime", "2024-01-10T10:30:00Z"
            );
            
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting payment: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/callback")
    @Operation(summary = "Payment callback", description = "Handle payment callback from payment gateway")
    public ResponseEntity<?> handlePaymentCallback(@PathVariable Long id, @RequestBody Map<String, Object> callback) {
        try {
            String status = callback.get("status").toString();
            String transactionId = callback.get("transactionId").toString();
            
            // Update payment status based on callback
            Map<String, Object> response = Map.of(
                "paymentId", id,
                "status", status,
                "transactionId", transactionId,
                "message", "Payment callback processed successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error processing callback: " + e.getMessage()));
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get payment by appointment", description = "Get payment information for an appointment")
    public ResponseEntity<?> getPaymentByAppointment(@PathVariable Long appointmentId) {
        try {
            // Mock payment for appointment
            Map<String, Object> payment = Map.of(
                "id", 1,
                "appointmentId", appointmentId,
                "amount", 800000.0,
                "currency", "VND",
                "paymentMethod", "VNPAY",
                "status", "SUCCESS",
                "transactionId", "VNPAY123456",
                "paymentTime", "2024-01-10T10:30:00Z"
            );
            
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting payment: " + e.getMessage()));
        }
    }
} 