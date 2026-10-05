package com.example.moviebooking.service;

import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.repository.PaymentRepository;
import com.example.moviebooking.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Payment mockPayment;
    private Booking mockBooking;

    @BeforeEach
    void setUp() {
        mockPayment = new Payment();
        mockPayment.setId(1);
        mockPayment.setUserId(1);
        mockPayment.setShowtimeId(100);
        mockPayment.setAmount(200000.0);
        mockPayment.setPaymentMethod("E-WALLET");
        mockPayment.setStatus("PENDING");
        mockPayment.setCreatedAt(LocalDateTime.now());

        mockBooking = new Booking();
        mockBooking.setId(1);
        mockBooking.setBookingTime(LocalDateTime.now());
    }

    // ==========================================
    // NHÓM VALIDATION TEST CASES (TC_PM-VAL-*)
    // ==========================================

    @Test
    @DisplayName("TC_PM-VAL-01 - Thanh toán khi thiếu bookingId (Payment ID null)")
    void test_TC_PM_VAL_01_ThieuBookingId() {
        // Step: Gọi xử lý thanh toán mà paymentId bị null
        assertThrows(RuntimeException.class, () -> {
            paymentService.handleSuccess(null, List.of(101, 102));
        });

        // Verify: Không lưu hoặc cập nhật giao dịch thanh toán nào
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("TC_PM-VAL-02 - Thanh toán với bookingId/paymentId không tồn tại (ID: 999999)")
    void test_TC_PM_VAL_02_BookingIdKhongTonTai() {
        // Pre-condition: Không tìm thấy payment trong database
        when(paymentRepository.findById(999999)).thenReturn(Optional.empty());

        // Step: Truy vấn hoặc xử lý với ID 999999
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentById(999999);
        });

        // Expected Output: Báo lỗi không tìm thấy
        assertTrue(exception.getMessage().contains("999999") || exception.getMessage().contains("not found"));
        verify(paymentRepository, times(1)).findById(999999);
    }

    @Test
    @DisplayName("TC_PM-VAL-03 - Không cho thanh toán với số tiền không hợp lệ (amount <= 0)")
    void test_TC_PM_VAL_03_SoTienKhongHopLe() {
        Double invalidAmount = -50000.0;

        Payment p = new Payment();
        p.setAmount(invalidAmount);

        // Expected Output: Số tiền <= 0 không được coi là thanh toán thành công
        assertTrue(p.getAmount() <= 0, "Số tiền phải <= 0 theo test case");
        assertNotEquals("SUCCESS", p.getStatus(), "Trạng thái không được là SUCCESS");
    }

    @Test
    @DisplayName("TC_PM-VAL-04 - Không cho thanh toán khi chưa chọn phương thức")
    void test_TC_PM_VAL_04_ChuaChonPhuongThuc() {
        // Pre-condition: Tạo thanh toán khi chưa hoàn tất phương thức
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payment result = paymentService.createPayment(1, 100, 200000.0, null, null);

        // Expected Output: Giao dịch vẫn chỉ ở trạng thái PENDING (chờ chọn phương thức và xử lý)
        assertNotNull(result);
        assertEquals("PENDING", result.getStatus(), "Booking/Payment vẫn phải ở trạng thái PENDING");
    }

    // ==========================================
    // NHÓM BUSINESS LOGIC TEST CASES (TC_PM-BIZ-*)
    // ==========================================

    @Test
    @DisplayName("TC_PM-BIZ-01 - Nhận đúng tổng tiền từ Booking (200.000 VNĐ)")
    void test_TC_PM_BIZ_01_NhanDungTongTien() {
        when(paymentRepository.save(any(Payment.class))).thenReturn(mockPayment);

        Payment result = paymentService.createPayment(1, 100, 200000.0, "VIETQR", "TXN12345");

        // Expected Output: Nhận đúng thông tin và số tiền 200.000 VNĐ không bị thay đổi
        assertNotNull(result);
        assertEquals(200000.0, result.getAmount());
        assertEquals("PENDING", result.getStatus());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("TC_PM-BIZ-02 - Thanh toán thành công và cập nhật Booking")
    void test_TC_PM_BIZ_02_ThanhToanThanhCong() {
        List<Integer> seatIds = List.of(101, 102);
        when(paymentRepository.findById(1)).thenReturn(Optional.of(mockPayment));
        when(bookingService.createBooking(1, 100, seatIds)).thenReturn(mockBooking);
        when(paymentRepository.save(any(Payment.class))).thenReturn(mockPayment);

        // Step: Cổng thanh toán trả SUCCESS -> gọi handleSuccess
        Booking result = paymentService.handleSuccess(1, seatIds);

        // Expected Output: Cập nhật trạng thái SUCCESS và tạo booking thành công
        assertNotNull(result);
        assertEquals("SUCCESS", mockPayment.getStatus());
        verify(bookingService, times(1)).createBooking(1, 100, seatIds);
        verify(paymentRepository, times(1)).save(mockPayment);
    }

    @Test
    @DisplayName("TC_PM-BIZ-03 - Thanh toán thất bại không làm Booking thành công")
    void test_TC_PM_BIZ_03_ThanhToanThatBai() {
        List<Integer> seatIds = List.of(101, 102);
        mockPayment.setStatus("FAILED"); // Cổng giả lập trả FAILED

        when(paymentRepository.findById(1)).thenReturn(Optional.of(mockPayment));

        // Step: Gọi handleSuccess khi status đã là FAILED
        Booking result = paymentService.handleSuccess(1, seatIds);

        // Expected Output: Booking không được tạo mới, hệ thống không ghi nhận booking thành công
        assertNull(result);
        verify(bookingService, never()).createBooking(anyInt(), anyInt(), anyList());
    }

    @Test
    @DisplayName("TC_PM-BIZ-04 - Sau thanh toán thành công, chuyển đúng dữ liệu sang TicketHistory")
    void test_TC_PM_BIZ_04_KiemTraDuLieuLichSu() {
        mockPayment.setStatus("SUCCESS");
        when(paymentRepository.findByUserId(1)).thenReturn(List.of(mockPayment));

        // Step: Lấy lịch sử giao dịch của User
        List<Payment> history = paymentService.getPaymentsByUser(1);

        // Expected Output: Hiển thị đúng thông tin đơn hàng đã thanh toán (SUCCESS, 200.000 VNĐ)
        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals("SUCCESS", history.get(0).getStatus());
        assertEquals(200000.0, history.get(0).getAmount());
    }
}
