package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.config.VnPayConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@Service
public class VnPayService {
    @Autowired
    private VnPayConfig vnPayConfig;

    // Sinh URL thanh toán VNPay
    public String createPaymentUrl(Map<String, String> params) {
        try {
            // Thêm các tham số bắt buộc cho VNPay sandbox
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            params.put("vnp_IpAddr", "127.0.0.1");
            params.put("vnp_CreateDate", new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
            
            // Đảm bảo có OrderInfo và OrderType
            if (!params.containsKey("vnp_OrderInfo")) {
                params.put("vnp_OrderInfo", "Thanh toan khoa hoc");
            }
            if (!params.containsKey("vnp_OrderType")) {
                params.put("vnp_OrderType", "other");
            }

            // Sắp xếp tham số theo thứ tự alphabet
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            
            System.out.println("📋 All VNPay parameters:");
            for (String key : fieldNames) {
                System.out.println("   " + key + " = " + params.get(key));
            }
            
            for (int i = 0; i < fieldNames.size(); i++) {
                String name = fieldNames.get(i);
                String value = params.get(name);
                if ((value != null) && (value.length() > 0)) {
                    // Build hash data (không encode)
                    hashData.append(name).append('=').append(value);
                    if (i < fieldNames.size() - 1) {
                        hashData.append('&');
                    }
                    
                    // Build query string (có encode)
                    query.append(URLEncoder.encode(name, StandardCharsets.UTF_8)).append('=')
                         .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                    if (i < fieldNames.size() - 1) {
                        query.append('&');
                    }
                }
            }
            
            // Tạo chữ ký HMAC SHA512
            String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);
            
            String finalUrl = vnPayConfig.getPaymentUrl() + "?" + query.toString();
            System.out.println("🔗 VNPay URL generated: " + finalUrl);
            System.out.println("🔑 Hash data: " + hashData.toString());
            System.out.println("🔐 Secure hash: " + secureHash);
            System.out.println("🔑 Hash secret: " + vnPayConfig.getHashSecret());
            
            return finalUrl;
        } catch (Exception e) {
            System.out.println("❌ Error creating VNPay URL: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creating VNPay payment URL", e);
        }
    }

    // Xác thực callback từ VNPay
    public boolean validateVnPayResponse(Map<String, String> params, String receivedHash) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String name : fieldNames) {
            if (name.equals("vnp_SecureHash") || name.equals("vnp_SecureHashType")) continue;
            String value = params.get(name);
            if ((value != null) && (value.length() > 0)) {
                hashData.append(name).append('=').append(value).append('&');
            }
        }
        if (hashData.length() > 0) hashData.setLength(hashData.length() - 1); // remove last &
        String calculatedHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        return calculatedHash.equalsIgnoreCase(receivedHash);
    }

    // Hàm tạo HMAC SHA512
    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac hmac512 = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            // Convert to hex string (lowercase)
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hash.append('0');
                hash.append(hex);
            }
            
            System.out.println("🔐 HMAC input: " + data);
            System.out.println("🔐 HMAC key: " + key);
            System.out.println("🔐 HMAC result: " + hash.toString());
            
            return hash.toString();
        } catch (Exception e) {
            System.out.println("❌ HMAC SHA512 error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error while calculating HMAC SHA512", e);
        }
    }
} 