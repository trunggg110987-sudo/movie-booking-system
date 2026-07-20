# 🎬 Movie Booking System - Backend

A production-oriented RESTful API for an online movie ticket booking platform, built with **Spring Boot** following clean architecture principles and RESTful API design.

The system allows customers to browse movies, reserve seats, purchase tickets, manage bookings, and securely authenticate using JWT. It also provides administrative features for managing cinemas, schedules, movies, and users.

This project focuses on building a scalable backend using modern Java technologies and best practices commonly adopted in enterprise applications.

---

# 🚀 Features

### Authentication & Authorization

- User Registration
- Secure Login with JWT Authentication
- Role-Based Authorization (ADMIN / CUSTOMER)
- Password Encryption (BCrypt)
- Stateless Authentication

---

### Movie Management

- CRUD Movies
- Movie Categories
- Movie Details
- Movie Search
- Upcoming / Now Showing

---

### Cinema Management

- Cinema Management
- Theater Rooms
- Seat Management
- Showtimes Scheduling

---

### Booking Management

- Browse Available Showtimes
- Seat Reservation
- Ticket Booking
- Booking History
- Booking Status

---

### Payment

- Booking Confirmation
- Payment Processing
- Ticket Generation

---

### Administration

- Manage Users
- Manage Movies
- Manage Cinemas
- Manage Showtimes
- Dashboard APIs

---

# 🏛 System Architecture

The application follows the classic **3-Tier Architecture** to ensure maintainability, scalability, and separation of concerns.

```
                 Client
                    │
             REST API (JSON)
                    │
        ┌────────────────────┐
        │   Controller Layer │
        └────────────────────┘
                    │
        ┌────────────────────┐
        │    Service Layer   │
        │ Business Logic     │
        └────────────────────┘
                    │
        ┌────────────────────┐
        │ Repository Layer   │
        │ Spring Data JPA    │
        └────────────────────┘
                    │
                MySQL Database
```

Each layer has a dedicated responsibility:

- **Controller** handles HTTP requests and validation.
- **Service** contains business rules and transaction logic.
- **Repository** communicates with the database through JPA/Hibernate.

---

# 🔐 Security

The project secures APIs using **Spring Security** with **JWT Authentication**.

Authentication flow:

```
Client
   │
Login
   │
   ▼
AuthenticationManager
   │
Generate JWT
   │
Return Access Token
   │
──────────────
Client stores JWT
   │
Authorization: Bearer <token>
   │
JWT Filter
   │
Spring Security
   │
Protected API
```

Security features include:

- JWT Access Token
- BCrypt Password Encoding
- Stateless Session
- Custom Authentication Filter
- Role-Based Access Control
- Unauthorized Request Handling

---

# 🗂 Project Structure

```
src/main/java
│
├── config
├── controller
├── dto
├── entity
├── repository
├── security
├── service
│   └── impl
├── exception
├── util
└── MovieBookingApplication.java
```

The project follows package-by-layer organization for better readability and maintainability.

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Language | Java 17 |
| Framework | Spring Boot |
| Security | Spring Security + JWT |
| ORM | Hibernate |
| Persistence | Spring Data JPA |
| Database | MySQL 8 |
| Build Tool | Maven |
| Documentation | Swagger / OpenAPI |
| Utilities | Lombok |
| Validation | Jakarta Validation |

---

# ⚙️ Prerequisites

Before running the application, ensure the following software is installed:

- Java 17+
- Maven 3.8+
- MySQL 8+
- Git
- IntelliJ IDEA (Recommended)

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/movie-booking.git

cd movie-booking
```

---

## Configure Database

Create a MySQL database:

```sql
CREATE DATABASE movie_booking;
```

Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/movie_booking

spring.datasource.username=root

spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true

spring.jpa.properties.hibernate.format_sql=true
```

---

## Install Dependencies

```bash
mvn clean install
```

---

## Run Application

```bash
mvn spring-boot:run
```

or execute

```
MovieBookingApplication.java
```

The server will start on

```
http://localhost:8080
```

---

# 📖 API Documentation

Swagger UI

```
http://localhost:8080/swagger-ui/index.html
```

OpenAPI

```
http://localhost:8080/v3/api-docs
```

---

# 🔍 API Testing

Example

```http
POST /api/auth/login
```

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Response

```json
{
  "accessToken": "...",
  "tokenType": "Bearer"
}
```

Use the returned token for protected endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🧩 Design Principles

This project follows several software engineering best practices:

- RESTful API Design
- Layered Architecture
- Dependency Injection
- SOLID Principles
- Separation of Concerns
- DTO Pattern
- Repository Pattern
- Service Pattern
- Global Exception Handling
- Validation
- Stateless Authentication

---

# 📌 Future Improvements

- Refresh Token Authentication
- Email Notification
- Online Payment Integration (VNPay / Stripe)
- Redis Cache
- Docker Deployment
- Unit Testing
- Integration Testing
- CI/CD Pipeline
- Microservices Migration

---

# 👨‍💻 Author

Developed as a portfolio project to demonstrate backend development skills using Java and Spring Boot, with a focus on clean architecture, security, and scalable REST API design.