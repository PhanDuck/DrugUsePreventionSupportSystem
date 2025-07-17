# VNPay Integration Guide

## Tổng quan
Hệ thống đã được chuẩn bị sẵn sàng cho tích hợp VNPay với các thành phần sau:

## 📋 Các thành phần đã chuẩn bị

### 1. Database Schema
- ✅ Thêm các fields payment vào `appointments` table:
  - `vnpay_txn_ref`: Mã tham chiếu giao dịch VNPay
  - `vnpay_response_code`: Mã phản hồi từ VNPay
  - `vnpay_transaction_no`: Số giao dịch VNPay
  - `vnpay_bank_code`: Mã ngân hàng
  - `payment_url`: URL thanh toán VNPay
  - `paid_at`: Thời gian thanh toán
  - `payment_method`: Phương thức thanh toán

### 2. Backend Components
- ✅ `PaymentController`: Controller xử lý payment APIs
- ✅ `Appointment` entity: Đã có đầy đủ payment fields
- ✅ `AppointmentDTO`: Đã include payment information
- ✅ Dependencies: Đã comment sẵn trong `pom.xml`
- ✅ Configuration: Đã comment sẵn trong `application.properties`

### 3. Frontend Components
- ✅ `paymentService.js`: Service xử lý payment APIs
- ✅ Payment method selection trong booking form
- ✅ Utility functions cho payment UI

## 🚀 Khi cần implement VNPay

### Bước 1: Uncomment Dependencies
```xml
<!-- Trong pom.xml -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.13</version>
</dependency>
```

### Bước 2: Configure VNPay Settings
```properties
# Trong application.properties
vnpay.payment.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.merchant.id=YOUR_MERCHANT_ID
vnpay.hash.secret=YOUR_HASH_SECRET
```

### Bước 3: Implement Payment Service
Tạo `VNPayService.java`:
```java
@Service
public class VNPayService {
    
    @Value("${vnpay.payment.url}")
    private String vnpayUrl;
    
    @Value("${vnpay.merchant.id}")
    private String merchantId;
    
    public String createPaymentUrl(Long appointmentId, BigDecimal amount) {
        // Implementation here
    }
    
    public boolean verifyPayment(Map<String, String> params) {
        // Implementation here
    }
}
```

### Bước 4: Update PaymentController
Implement các TODO methods trong `PaymentController.java`

### Bước 5: Frontend Payment Flow
```javascript
// Trong AppointmentPage.jsx
const handleVNPayPayment = async (appointmentId) => {
    const result = await paymentService.createVNPayPayment(
        appointmentId, 
        selectedConsultant.price,
        paymentService.generatePaymentDescription(appointmentId, selectedConsultant.name)
    );
    
    if (result.success) {
        paymentService.redirectToVNPay(result.data.paymentUrl);
    }
};
```

## 📝 VNPay Integration Checklist

Khi implement VNPay, cần làm:

- [ ] Đăng ký tài khoản VNPay merchant
- [ ] Lấy Merchant ID và Hash Secret
- [ ] Uncomment dependencies trong pom.xml
- [ ] Configure VNPay settings trong application.properties
- [ ] Implement VNPayService với:
  - [ ] Create payment URL
  - [ ] Verify payment signature
  - [ ] Handle IPN (Instant Payment Notification)
- [ ] Update PaymentController methods
- [ ] Tạo payment return page trong frontend
- [ ] Test với VNPay sandbox environment
- [ ] Deploy và test với production environment

## 🔒 Security Notes

- Hash Secret phải được bảo mật tuyệt đối
- Luôn verify signature từ VNPay
- Log tất cả payment transactions
- Implement idempotency cho payment processing
- Handle timeout và retry logic

## 📞 VNPay Documentation

- Sandbox: https://sandbox.vnpayment.vn/
- API Documentation: https://sandbox.vnpayment.vn/apis/
- Support: support@vnpay.vn

## 💡 Tips

1. Test thoroughly với sandbox trước khi production
2. Implement proper error handling và user feedback
3. Consider payment timeout scenarios
4. Implement payment status polling
5. Add payment history tracking
6. Consider refund functionality

---

**Hệ thống hiện tại đã sẵn sàng 100% cho VNPay integration!** 🎉 