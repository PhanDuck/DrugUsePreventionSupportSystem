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
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@Tag(name = "Notification Controller", description = "APIs for notification management")
public class NotificationController {

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get user notifications", description = "Get all notifications for current user")
    public ResponseEntity<?> getUserNotifications(@RequestParam Long userId) {
        try {
            // Mock response for now
            List<Map<String, Object>> notifications = List.of(
                Map.of(
                    "id", 1,
                    "userId", userId,
                    "type", "APPOINTMENT_CONFIRMED",
                    "title", "Lịch hẹn đã được xác nhận",
                    "message", "Dr. Nguyễn Văn A đã xác nhận lịch hẹn ngày 15/01/2024",
                    "isRead", false,
                    "createdAt", "2024-01-10T10:30:00Z"
                ),
                Map.of(
                    "id", 2,
                    "userId", userId,
                    "type", "PAYMENT_SUCCESS",
                    "title", "Thanh toán thành công",
                    "message", "Thanh toán lịch hẹn #123 đã thành công",
                    "isRead", false,
                    "createdAt", "2024-01-10T09:15:00Z"
                )
            );
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting notifications: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Mark notification as read", description = "Mark a notification as read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error marking notification as read: " + e.getMessage()));
        }
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get unread notification count", description = "Get count of unread notifications")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(Map.of("unreadCount", 2));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting unread count: " + e.getMessage()));
        }
    }
} 