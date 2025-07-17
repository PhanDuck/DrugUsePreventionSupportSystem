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
            // Thêm các tham số bắt buộc
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            params.put("vnp_IpAddr", "127.0.0.1");
            params.put("vnp_CreateDate", new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

            // Sắp xếp tham số theo thứ tự alphabet
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (String name : fieldNames) {
                String value = params.get(name);
                if ((value != null) && (value.length() > 0)) {
                    hashData.append(name).append('=').append(value);
                    query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII)).append('=')
                         .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    if (!name.equals(fieldNames.get(fieldNames.size() - 1))) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }
            // Tạo chữ ký
            String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);
            return vnPayConfig.getPaymentUrl() + "?" + query.toString();
        } catch (Exception e) {
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
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hash.append('0');
                hash.append(hex);
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating HMAC SHA512", e);
        }
    }
} 