package com.drugprevention.drugbe.config;

import org.springframework.stereotype.Component;

@Component
public class VnPayConfig {
    private String tmnCode = "YOUR_TMN_CODE";
    private String hashSecret = "YOUR_HASH_SECRET";
    private String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private String returnUrl = "http://localhost:3000/payment/return";
    private String ipnUrl = "http://localhost:8080/api/payments/vnpay/callback";

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