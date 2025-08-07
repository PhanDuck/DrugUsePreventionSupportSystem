package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Payment;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.Appointment;
import com.drugprevention.drugbe.dto.AppointmentPaymentRequest;
import com.drugprevention.drugbe.dto.AppointmentDTO;
import com.drugprevention.drugbe.service.PaymentService;
import com.drugprevention.drugbe.service.VnPayService;
import com.drugprevention.drugbe.service.AppointmentService;
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
    @Autowired
    private AppointmentService appointmentService;

    // Tạo payment VNPay và trả về paymentUrl
    @PostMapping("/vnpay/create")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> createVnPayPayment(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            System.out.println("=== VNPAY PAYMENT CREATE ===");
            System.out.println("Request: " + request);
            System.out.println("Principal: " + (principal != null ? principal.getName() : "NULL"));
            
            // Support both appointment and course payments
            Long appointmentId = request.get("appointmentId") != null ? Long.valueOf(request.get("appointmentId").toString()) : null;
            Long courseId = request.get("courseId") != null ? Long.valueOf(request.get("courseId").toString()) : null;
            Double amount = Double.valueOf(request.get("amount").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            String description = request.getOrDefault("description", "Payment for course enrollment").toString();
            String paymentType = request.getOrDefault("type", "COURSE").toString(); // COURSE or APPOINTMENT

            System.out.println("Course ID: " + courseId);
            System.out.println("Amount: " + amount);
            System.out.println("User ID: " + userId);
            System.out.println("Description: " + description);

            // Tạo payment entity
            Payment payment = new Payment();
            if (appointmentId != null) {
                payment.setAppointment(null); // Set appointment if needed
            }
            payment.setUser(new User()); payment.getUser().setId(userId);
            payment.setAmount(BigDecimal.valueOf(amount));
            payment.setCurrency("VND");
            payment.setPaymentMethod("VNPAY");
            payment.setStatus("PENDING");
            payment.setDescription(description);
            payment.setCreatedAt(LocalDateTime.now());
            payment = paymentService.createPayment(payment);

            System.out.println("Payment created with ID: " + payment.getId());

            // Tạo params cho VNPay
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Amount", String.valueOf((long)(amount * 100))); // VNPay requires amount * 100
            
            // Build OrderInfo properly
            String orderInfo = description;
            if (courseId != null) {
                orderInfo = description + " - Course ID: " + courseId;
            } else if (appointmentId != null) {
                orderInfo = description + " - Appointment ID: " + appointmentId;
            }
            
            vnpParams.put("vnp_OrderInfo", orderInfo);
            vnpParams.put("vnp_OrderType", paymentType.toLowerCase());
            vnpParams.put("vnp_TxnRef", payment.getId().toString());

            System.out.println("VNPay params: " + vnpParams);

            String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
            payment.setPaymentUrl(paymentUrl);
            paymentService.createPayment(payment); // update lại paymentUrl

            System.out.println("Payment URL: " + paymentUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", payment.getId());
            response.put("paymentUrl", paymentUrl);
            response.put("status", payment.getStatus());
            
            System.out.println("Response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating VNPay payment: " + e.getMessage()));
        }
    }

    // Tạo payment cho appointment
    @PostMapping("/appointment/create")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> createAppointmentPayment(@RequestBody AppointmentPaymentRequest request, Principal principal) {
        try {
            System.out.println("=== APPOINTMENT PAYMENT CREATE ===");
            System.out.println("Request: " + request);
            System.out.println("Principal: " + (principal != null ? principal.getName() : "NULL"));
            
            // Validate appointment exists and belongs to user
            AppointmentDTO appointmentDTO = appointmentService.getAppointmentById(request.getAppointmentId());
            if (appointmentDTO == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Appointment not found"));
            }
            
            // Get appointment entity for payment
            Appointment appointment = appointmentService.getAppointmentEntityById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment entity not found"));
            
            // Check if appointment belongs to current user
            if (!appointment.getClient().getId().toString().equals(principal.getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Access denied. Appointment does not belong to current user."));
            }
            
            // Check if appointment is pending payment
            if (!"PENDING".equals(appointment.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Appointment is not in pending status for payment."));
            }
            
            System.out.println("Appointment ID: " + request.getAppointmentId());
            System.out.println("Amount: " + request.getAmount());
            System.out.println("Description: " + request.getDescription());

            // Tạo payment entity
            Payment payment = new Payment();
            payment.setAppointment(appointment);
            payment.setUser(appointment.getClient());
            payment.setAmount(request.getAmount());
            payment.setCurrency("VND");
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus("PENDING");
            payment.setDescription(request.getDescription());
            payment.setCreatedAt(LocalDateTime.now());
            payment = paymentService.createPayment(payment);

            System.out.println("Payment created with ID: " + payment.getId());

            // Tạo params cho VNPay
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Amount", String.valueOf((long)(request.getAmount().doubleValue() * 100))); // VNPay requires amount * 100
            vnpParams.put("vnp_OrderInfo", request.getDescription() + " - Appointment ID: " + request.getAppointmentId());
            vnpParams.put("vnp_OrderType", "appointment");
            vnpParams.put("vnp_TxnRef", payment.getId().toString());

            System.out.println("VNPay params: " + vnpParams);

            String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
            payment.setPaymentUrl(paymentUrl);
            paymentService.createPayment(payment); // update lại paymentUrl

            System.out.println("Payment URL: " + paymentUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", payment.getId());
            response.put("paymentUrl", paymentUrl);
            response.put("status", payment.getStatus());
            response.put("appointmentId", request.getAppointmentId());
            
            System.out.println("Response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating appointment payment: " + e.getMessage()));
        }
    }

    // VNPay callback xử lý kết quả thanh toán
    @PostMapping("/vnpay/return")
    public ResponseEntity<?> handleVnPayReturn(@RequestBody Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            if (vnpSecureHash != null) {
                params.remove("vnp_SecureHash");
            }
            
            boolean isValid = vnPayService.validateVnPayResponse(params, vnpSecureHash);
            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");
            String orderInfo = params.get("vnp_OrderInfo");
            
            Map<String, Object> response = new HashMap<>();
            response.put("isValid", isValid);
            response.put("responseCode", responseCode);
            response.put("transactionId", txnRef);
            
            if (isValid && "00".equals(responseCode)) {
                // Payment successful - extract courseId or appointmentId from orderInfo
                Long courseId = null;
                Long appointmentId = null;
                
                if (orderInfo != null) {
                    if (orderInfo.contains("Course ID: ")) {
                        try {
                            String courseIdStr = orderInfo.substring(orderInfo.indexOf("Course ID: ") + 11);
                            if (courseIdStr.contains(" ")) {
                                courseIdStr = courseIdStr.substring(0, courseIdStr.indexOf(" "));
                            }
                            courseId = Long.valueOf(courseIdStr);
                        } catch (Exception e) {
                            System.err.println("Error extracting courseId from orderInfo: " + e.getMessage());
                        }
                    } else if (orderInfo.contains("Appointment ID: ")) {
                        try {
                            String appointmentIdStr = orderInfo.substring(orderInfo.indexOf("Appointment ID: ") + 16);
                            if (appointmentIdStr.contains(" ")) {
                                appointmentIdStr = appointmentIdStr.substring(0, appointmentIdStr.indexOf(" "));
                            }
                            appointmentId = Long.valueOf(appointmentIdStr);
                        } catch (Exception e) {
                            System.err.println("Error extracting appointmentId from orderInfo: " + e.getMessage());
                        }
                    }
                }
                
                // Update payment status
                try {
                    Long paymentId = Long.valueOf(txnRef);
                    paymentService.updatePaymentStatus(paymentId, "SUCCESS");
                    
                    // Update appointment status if this is an appointment payment
                    if (appointmentId != null) {
                        appointmentService.updateAppointmentStatus(appointmentId, "CONFIRMED");
                    }
                } catch (Exception e) {
                    System.err.println("Error updating payment/appointment status: " + e.getMessage());
                }
                
                response.put("success", true);
                response.put("message", "Payment successful");
                response.put("courseId", courseId);
                response.put("appointmentId", appointmentId);
                
            } else {
                // Payment failed
                try {
                    Long paymentId = Long.valueOf(txnRef);
                    paymentService.updatePaymentStatus(paymentId, "FAILED");
                } catch (Exception e) {
                    System.err.println("Error updating payment status: " + e.getMessage());
                }
                
                response.put("success", false);
                response.put("message", "Payment failed or invalid");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Error processing VNPay return: " + e.getMessage()
            ));
        }
    }

    // VNPay IPN (Instant Payment Notification) - webhook từ VNPay
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