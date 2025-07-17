package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Payment;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.PaymentService;
import com.drugprevention.drugbe.service.VnPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private VnPayService vnPayService;

    // Tạo payment VNPay và trả về paymentUrl
    @PostMapping("/vnpay/create")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> createVnPayPayment(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            Long appointmentId = Long.valueOf(request.get("appointmentId").toString());
            Double amount = Double.valueOf(request.get("amount").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            String description = request.getOrDefault("description", "Payment for appointment").toString();

            // Tạo payment entity
            Payment payment = new Payment();
            payment.setAppointment(null); // Có thể set lại nếu cần fetch Appointment entity
            payment.setUser(new User()); payment.getUser().setId(userId);
            payment.setAmount(BigDecimal.valueOf(amount));
            payment.setCurrency("VND");
            payment.setPaymentMethod("VNPAY");
            payment.setStatus("PENDING");
            payment.setDescription(description);
            payment.setCreatedAt(LocalDateTime.now());
            payment = paymentService.createPayment(payment);

            // Tạo params cho VNPay
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Amount", String.valueOf((long)(amount * 100))); // VNPay yêu cầu amount * 100
            vnpParams.put("vnp_TxnRef", payment.getId().toString());
            vnpParams.put("vnp_OrderInfo", description);
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_IpAddr", "127.0.0.1");

            String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
            payment.setPaymentUrl(paymentUrl);
            paymentService.createPayment(payment); // update lại paymentUrl

            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", payment.getId());
            response.put("paymentUrl", paymentUrl);
            response.put("status", payment.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating VNPay payment: " + e.getMessage()));
        }
    }

    // Nhận callback từ VNPay (IPN hoặc return)
    @PostMapping("/vnpay/callback")
    public ResponseEntity<?> handleVnPayCallback(@RequestParam Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            if (!vnPayService.validateVnPayResponse(params, vnpSecureHash)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid VNPay signature!"));
            }
            String txnRef = params.get("vnp_TxnRef");
            String status = params.get("vnp_ResponseCode").equals("00") ? "SUCCESS" : "FAILED";
            Payment payment = paymentService.getPaymentById(Long.valueOf(txnRef)).orElse(null);
            if (payment == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment not found!"));
            }
            payment.setStatus(status);
            payment.setTransactionId(params.get("vnp_TransactionNo"));
            payment.setGatewayResponse(params.toString());
            if (status.equals("SUCCESS")) payment.setPaidAt(LocalDateTime.now());
            paymentService.createPayment(payment);
            return ResponseEntity.ok(Map.of("message", "Payment status updated", "status", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error processing VNPay callback: " + e.getMessage()));
        }
    }

    // Lấy trạng thái payment
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        Optional<Payment> paymentOpt = paymentService.getPaymentById(id);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", payment.getId());
            response.put("status", payment.getStatus());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("paymentMethod", payment.getPaymentMethod());
            response.put("description", payment.getDescription());
            response.put("transactionId", payment.getTransactionId());
            response.put("paymentUrl", payment.getPaymentUrl());
            response.put("createdAt", payment.getCreatedAt());
            response.put("paidAt", payment.getPaidAt());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 