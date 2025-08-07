package com.drugprevention.drugbe.config;

import org.springframework.stereotype.Component;

@Component
public class VnPayConfig {
    // VNPay Sandbox Demo credentials (Original - Known Working)
    private String tmnCode = "2QXUI4J4";
    private String hashSecret = "SNPJOXZWBGTKSJRRMGFNKRFQPJGMRFGJ";
    private String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private String returnUrl = "http://localhost:5173/payment/return";
    private String ipnUrl = "http://localhost:8080/api/payments/vnpay/callback";

    // Alternative demo credentials
    // private String tmnCode = "TMNC";
    // private String hashSecret = "SECRET_SHA256";

    public String getTmnCode() { return tmnCode; }
    public void setTmnCode(String tmnCode) { this.tmnCode = tmnCode; }

    public String getHashSecret() { return hashSecret; }
    public void setHashSecret(String hashSecret) { this.hashSecret = hashSecret; }

    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }

    public String getReturnUrl() { return returnUrl; }
    public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }

    public String getIpnUrl() { return ipnUrl; }
    public void setIpnUrl(String ipnUrl) { this.ipnUrl = ipnUrl; }
} 