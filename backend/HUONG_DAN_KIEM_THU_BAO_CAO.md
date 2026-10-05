# 📋 TÀI LIỆU HƯỚNG DẪN KIỂM THỬ & CHỤP ẢNH BÁO CÁO (MÔN KIỂM THỬ PHẦN MỀM)

> **Dự án:** Hệ thống Đặt vé xem phim (Movie Booking System)  
> **Phạm vi kiểm thử trọng tâm:** Module Đặt vé (`BookingService`) & Module Giữ ghế (`SeatLockService`)  
> **Công nghệ sử dụng:** Spring Boot, JUnit 5, Mockito, JaCoCo, Postman, Swagger UI  

---

## 📑 MỤC LỤC
1. [Tổng hợp danh sách Test Cases](#1-tổng-hợp-danh-sách-test-cases)
2. [Hướng dẫn chi tiết từng bước Test & Chụp màn hình](#2-hướng-dẫn-chi-tiết-từng-bước-test--chụp-màn-hình)
   - [Bước 1: Chạy Unit Test tự động (JUnit 5 & Mockito)](#bước-1-chạy-unit-test-tự-động-junit-5--mockito)
   - [Bước 2: Xem Báo cáo Độ bao phủ mã nguồn (JaCoCo Coverage)](#bước-2-xem-báo-cáo-độ-bao-phủ-mã-nguồn-jacoco-coverage)
   - [Bước 3: Kiểm thử chức năng API với Postman](#bước-3-kiểm-thử-chức-năng-api-với-postman)
   - [Bước 4: Kiểm thử giao diện Swagger UI](#bước-4-kiểm-thử-giao-diện-swagger-ui)
3. [Mẫu Báo cáo lỗi (Bug Report) mẫu đưa vào bài](#3-mẫu-báo-cáo-lỗi-bug-report-mẫu-đưa-vào-bài)
4. [Bố cục gợi ý cho Báo cáo / Slide](#4-bố-cục-gợi-ý-cho-báo-cáo--slide)

---

## 1. TỔNG HỢP DANH SÁCH TEST CASES

### A. Module Đặt vé (`BookingServiceImplTest.java` - 9 Test Cases)
| Mã TC | Tên Test Case | Đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **TC_BK_01** | Đặt vé thành công (Happy Path) | `userId=1`, `showtimeId=100`, `seatIds=[101, 102]` | Lưu Booking, sinh Ticket, giải phóng SeatLock, trả về Booking | **PASS** |
| **TC_BK_02** | Ngoại lệ danh sách ghế rỗng | `seatIds=null` hoặc `[]` | Ném `BadRequestException("Seat IDs cannot be empty")` (400) | **PASS** |
| **TC_BK_03** | Ngoại lệ trùng lặp ID ghế | `seatIds=[101, 101]` | Ném `BadRequestException("Duplicate seat IDs are not allowed")` (400) | **PASS** |
| **TC_BK_04** | Ngoại lệ không tìm thấy User | `userId=999` (không tồn tại) | Ném `NotFoundException("User not found")` (404) | **PASS** |
| **TC_BK_05** | Ngoại lệ không tìm thấy Suất chiếu | `showtimeId=999` (không tồn tại) | Ném `NotFoundException("Showtime not found")` (404) | **PASS** |
| **TC_BK_06** | Ngoại lệ ghế không thuộc phòng chiếu | Ghế phòng 2 nhưng suất chiếu phòng 1 | Ném `BadRequestException("Seat does not belong to the showtime room")` (400) | **PASS** |
| **TC_BK_07** | Ngoại lệ ghế đã được mua vé | Ghế đã tồn tại trong `tickets` của suất chiếu | Ném `BadRequestException("Seat is already booked")` (400) | **PASS** |
| **TC_BK_08** | Ngoại lệ ghế đang bị người khác giữ chỗ | Ghế có active lock thuộc `userId=2`, `userId=1` đặt | Ném `BadRequestException("Seat is being held by another user")` (400) | **PASS** |
| **TC_BK_09** | Cho phép đặt vé nếu ghế do chính mình giữ | Ghế có active lock thuộc `userId=1`, `userId=1` đặt | Đặt vé thành công, xóa lock | **PASS** |

---

### B. Module Giữ ghế (`SeatLockServiceTest.java` - 9 Test Cases)
| Mã TC | Tên Test Case | Đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **TC_LK_01** | Giữ ghế thành công | `seatIds=[101]`, `showtimeId=100`, `userId=1` | Lưu bản ghi vào bảng `seat_locks` với thời hạn 5 phút | **PASS** |
| **TC_LK_02** | Ngoại lệ danh sách ghế rỗng | `seatIds=[]` | Ném `BadRequestException("Seat IDs cannot be empty")` (400) | **PASS** |
| **TC_LK_03** | Ngoại lệ không tìm thấy Suất chiếu | `showtimeId=999` | Ném `NotFoundException("Showtime not found with id: 999")` (404) | **PASS** |
| **TC_LK_04** | Ngoại lệ không tìm thấy Ghế | `seatId=999` | Ném `NotFoundException("Seat not found with id: 999")` (404) | **PASS** |
| **TC_LK_05** | Ngoại lệ ghế không thuộc phòng chiếu | Ghế phòng A, suất chiếu phòng B | Ném `BadRequestException("Seat does not belong to the showtime room")` (400) | **PASS** |
| **TC_LK_06** | Ngoại lệ cố giữ ghế đã có vé bán | Ghế đã có trong `tickets` | Ném `BadRequestException("Seat is already booked")` (400) | **PASS** |
| **TC_LK_07** | Ngoại lệ ghế đang bị khóa | Ghế đang có active lock | Ném `BadRequestException("Seat already locked")` (400) | **PASS** |
| **TC_LK_08** | Hủy giữ ghế theo User | `userId=1` | Xóa tất cả các khóa ghế của `userId=1` | **PASS** |
| **TC_LK_09** | Dọn dẹp các khóa hết hạn | Gọi `cleanExpired()` | Xóa các bản ghi `expires_at < CURRENT_TIMESTAMP` | **PASS** |

---

## 2. HƯỚNG DẪN CHI TIẾT TỪNG BƯỚC TEST & CHỤP MÀN HÌNH

### 📸 Bước 1: Chạy Unit Test tự động (JUnit 5 & Mockito)
1. Mở PowerShell trong thư mục: `c:\movie-booking\backend\movie-booking`
2. Chạy lệnh:
   ```powershell
   .\mvnw.cmd test
   ```
3. **Chụp ảnh:** Màn hình kết quả terminal hiển thị:
   * `Tests run: 19, Failures: 0, Errors: 0, Skipped: 0`
   * `[INFO] BUILD SUCCESS`

---

### 📸 Bước 2: Xem Báo cáo Độ bao phủ mã nguồn (JaCoCo Coverage)
1. Mở trình duyệt web và dán đường dẫn file:
   ```text
   c:\movie-booking\backend\movie-booking\target\site\jacoco\index.html
   ```
2. **Chụp ảnh:**
   * **Ảnh 1:** Bảng thống kê % Coverage tổng quan (Element, Missed Instructions, Cov., Missed Branches).
   * **Ảnh 2:** Bấm vào `com.example.moviebooking.service.impl` -> Bấm vào `BookingServiceImpl` -> Chụp đoạn mã nguồn được phủ màu xanh lá cây (100% Covered).

---

### 📸 Bước 3: Kiểm thử chức năng API với Postman
1. **Khởi động Backend:**
   ```powershell
   cd c:\movie-booking\backend\movie-booking
   .\mvnw.cmd spring-boot:run
   ```
2. **Import Collection vào Postman:**
   * Mở ứng dụng Postman -> Bấm **Import**.
   * Chọn file: `c:\movie-booking\backend\movie_booking_postman_collection.json`.
3. **Chụp ảnh các kịch bản kiểm thử API:**
   * **Ảnh 1 (TC01 - Giữ ghế thành công):** Chọn request `SeatLock - TC01` -> Bấm **Send** -> Chụp kết quả `200 OK` và tab Test Results `PASS`.
   * **Ảnh 2 (TC02 - Bắt lỗi ghế đang bị giữ):** Chọn request `SeatLock - TC02` -> Bấm **Send** -> Chụp kết quả `400 Bad Request`, message `"Seat already locked"`.
   * **Ảnh 3 (TC03 - Bắt lỗi ghế đã được đặt):** Chọn request `Booking - TC02` -> Bấm **Send** -> Chụp kết quả `400 Bad Request`, message `"Seat is already booked"`.
   * **Ảnh 4 (Chạy Runner):** Chuột phải Collection -> Chọn **Run collection** -> Chụp bảng xanh toàn bộ 6/6 test passed.

---

### 📸 Bước 4: Kiểm thử giao diện Swagger UI
1. Mở trình duyệt vào link:
   ```text
   http://localhost:8080/swagger-ui/index.html
   ```
2. **Chụp ảnh:** Toàn cảnh Swagger UI với danh sách các API Controllers (`BookingController`, `SeatLockController`, `SeatController`,...).

---

## 3. MẪU BÁO CÁO LỖI (BUG REPORT) MẪU ĐƯA VÀO BÀI

Bạn có thể chèn bảng này vào mục **"Phát hiện & Khắc phục lỗi (Bug Finding & Resolution)"** trong báo cáo:

| Mã Bug | Tên lỗi phát hiện | Mức độ | Mô tả & Nguyên nhân | Cách khắc phục | Trạng thái |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **BUG-01** | Chưa kiểm tra ghế đã mua khi bấm Giữ ghế (`SeatLock`) | **High** | Người dùng vẫn có thể gọi API lock ghế đã được người khác thanh toán mua vé trước đó. | Bổ sung kiểm tra `ticketRepository.existsBySeatId...` trong hàm `lockSeats()` trước khi lưu lock. | **Fixed & Verified** |
| **BUG-02** | Mã lỗi HTTP không đúng chuẩn RESTful khi khóa ghế trùng | **Medium** | Hệ thống ném `RuntimeException` làm trả về HTTP `500 Internal Server Error` thay vì lỗi nghiệp vụ phía Client. | Đổi sang ném `BadRequestException("Seat already locked")` (HTTP 400). | **Fixed & Verified** |

---

## 4. BỐ CỤC GỢI Ý CHO BÁO CÁO / SLIDE THUYẾT TRÌNH

* **Phần 1: Giới thiệu hệ thống & Phạm vi kiểm thử:** Giới thiệu module Đặt vé & Giữ ghế xem phim.
* **Phần 2: Thiết kế kịch bản kiểm thử (Black-box Testing):**
  * Áp dụng kỹ thuật Phân vùng tương đương (Equivalence Partitioning) & Phân tích giá trị biên (Boundary Value Analysis) cho `seatIds`, `userId`, `showtimeId`.
* **Phần 3: Kiểm thử tự động mức Đơn vị (Unit Testing - White-box Testing):**
  * Danh sách 18 test cases với JUnit 5 & Mockito.
  * Báo cáo độ bao phủ mã nguồn với JaCoCo.
* **Phần 4: Kiểm thử tích hợp API (API Testing):**
  * Kiểm thử với Postman Collection Runner & Swagger UI.
* **Phần 5: Báo cáo Bug & Tổng kết:** Bảng Bug Report và kết luận bài tập lớn.
