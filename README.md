# 🎬 Movie Booking System (Hệ Thống Đặt Vé Xem Phim)

Dự án fullstack hoàn chỉnh bao gồm **Backend (Spring Boot)** và **Frontend (React TypeScript + Vite)** hỗ trợ đặt vé xem phim, quản lý rạp, phòng chiếu, suất chiếu, ghế ngồi và thanh toán.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Java 17** / **Spring Boot 3.x**
- **Spring Data JPA & Hibernate**
- **Spring Security & JWT Authentication**
- **MySQL Database**
- **Maven**
- **Lombok & Jakarta Validation**

### Frontend
- **React 19** + **TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router Dom v7**
- **Axios & Lucide React**

---

## 📁 Cấu Trúc Dự Án

`	ext
movie-booking-system/
├── backend/
│   └── movie-booking/             # Mã nguồn Spring Boot backend
│       ├── src/
│       ├── database/schema.sql    # File tạo database & schema
│       └── pom.xml
├── frontend/
│   └── movie-booking-client/      # Mã nguồn React TypeScript frontend
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── .gitignore
└── README.md
`

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Yêu Cầu Môi Trường (Prerequisites)
Cần cài đặt sẵn trên máy:
- **Git**
- **JDK 17** trở lên
- **Node.js** (phiên bản 18+ hoặc 20+) & **npm**
- **MySQL Server** (phiên bản 8.x)

---

### 2. Clone Mã Nguồn (Clone Repository)
Mở terminal/cmd trên máy tính và chạy lệnh:

`ash
git clone https://github.com/trunggg110987-sudo/movie-booking-system.git
cd movie-booking-system
`

---

### 3. Cấu Hình Cơ Sở Dữ Liệu (MySQL)
1. Mở MySQL Workbench hoặc MySQL CLI và tạo cơ sở dữ liệu:
   `sql
   CREATE DATABASE movie_booking;
   `
2. *(Tùy chọn)* Có thể import file ackend/movie-booking/database/schema.sql hoặc để Hibernate tự động sinh bảng (ddl-auto=update).
3. Kiểm tra và chỉnh sửa cấu hình kết nối DB tại:
   ackend/movie-booking/src/main/resources/application.properties
   `properties
   spring.datasource.url=jdbc:mysql://localhost:3306/movie_booking
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   `

---

### 4. Khởi Chạy Backend (Spring Boot)
Mở terminal mới tại thư mục gốc của dự án:

`ash
cd backend/movie-booking

# Trên Windows:
./mvnw spring-boot:run

# Hoặc trên Linux/macOS:
./mvnw spring-boot:run
`

> **Backend API chạy tại:** http://localhost:8080

---

### 5. Khởi Chạy Frontend (React + Vite)
Mở một terminal khác tại thư mục gốc của dự án:

`ash
cd frontend/movie-booking-client

# Cài đặt thư viện:
npm install

# Chạy server phát triển (Development mode):
npm run dev
`

> **Frontend chạy tại:** http://localhost:5173 (hoặc cổng hiển thị trên terminal).

---

## 📌 Các Tính Năng Chính
- **Xác thực:** Đăng ký, đăng nhập người dùng với JWT (Role USER / ADMIN).
- **Quản lý phim:** Xem danh sách phim, tìm kiếm phim, CRUD phim (Admin).
- **Rạp & Phòng chiếu:** Danh sách rạp, quản lý phòng và sơ đồ ghế.
- **Suất chiếu:** Xem suất chiếu theo phim/phòng/rạp, tạo suất chiếu mới.
- **Chọn ghế & Khóa ghế (Seat Lock):** Giữ ghế theo thời gian thực tránh xung đột đặt trùng ghế.
- **Thanh toán & Đặt vé:** Tạo giao dịch đặt vé, quản lý vé theo người dùng.
