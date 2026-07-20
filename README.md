<div align="center">

# 🎬 Movie Booking System - Backend

A production-oriented RESTful API for an online movie ticket booking platform built with **Java 17**, **Spring Boot**, **Spring Security**, **JWT**, **Hibernate**, and **MySQL**.

Designed following **Layered Architecture**, the project focuses on scalability, maintainability, clean code, and secure authentication.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-success)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![Hibernate](https://img.shields.io/badge/Hibernate-ORM-brown)
![Maven](https://img.shields.io/badge/Maven-Build-red)

</div>

---

# 📖 Overview

Movie Booking System is a backend application that provides RESTful APIs for managing an online cinema booking platform.

The system allows users to register accounts, authenticate using JWT, browse available movies, view showtimes, reserve seats, purchase tickets, and manage booking history. Administrators can manage movies, cinemas, showtimes, and monitor booking activities.

This project was developed to demonstrate practical backend development skills using Spring Boot and enterprise development best practices.

---

# ✨ Key Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- BCrypt Password Encryption
- Stateless Security

---

## 🎬 Movie Management

- View Movie List
- Movie Details
- Search Movies
- Movie Schedule

---

## 🏢 Cinema Management

- Cinema Management
- Room Management
- Seat Management
- Showtime Management

---

## 🎟 Booking Management

- Seat Reservation
- Seat Locking Mechanism
- Booking Confirmation
- Booking History

---

## 💳 Payment

- Payment Information
- Ticket Generation
- Booking Status Tracking

---

## ⚙ Administration

- Manage Users
- Manage Movies
- Manage Cinemas
- Manage Showtimes
- Monitor Bookings

---

# 🏗 System Architecture

The application follows the traditional **3-Tier Architecture**.

```
                Client
                   │
             HTTP / JSON
                   │
          REST Controllers
                   │
          Business Services
                   │
     Spring Data JPA Repository
                   │
              MySQL Database
```

### Presentation Layer

Responsible for handling HTTP requests and returning JSON responses.

```
controller/
```

---

### Business Layer

Contains business logic, transaction management, authentication, booking workflow, and validation.

```
service/
```

---

### Data Access Layer

Responsible for communicating with the database through Spring Data JPA and Hibernate.

```
repository/
```

---

# 🛡 Security Architecture

The project secures REST APIs using **Spring Security** and **JWT Authentication**.

Authentication workflow:

```
Client
   │
Login Request
   │
AuthenticationManager
   │
Generate JWT Token
   │
Return Access Token
   │
───────────────
Client stores token
   │
Authorization: Bearer <JWT>
   │
JWT Filter
   │
Spring Security
   │
Protected APIs
```

Security features include:

- JWT Authentication
- Stateless Session
- Password Encryption
- Role-Based Authorization
- Custom Security Configuration

---

# 🎟 Seat Locking Mechanism

To prevent multiple users from booking the same seat simultaneously, the system implements a **Seat Lock** strategy.

Booking flow:

```
Select Seats
      │
Create Seat Lock
      │
Payment
      │
 ┌──────────────┐
 │ Success      │
 │              │
 ▼              ▼
Create Ticket   Release Seat Lock
```

Expired seat locks are automatically released by a scheduled task, allowing other users to reserve the seats.

---

# 🛠 Technology Stack

| Category | Technology |
|----------|------------|
| Language | Java 17 |
| Framework | Spring Boot |
| Security | Spring Security |
| Authentication | JWT |
| ORM | Hibernate |
| Persistence | Spring Data JPA |
| Database | MySQL |
| Build Tool | Maven |
| Validation | Jakarta Validation |
| API Documentation | Swagger / OpenAPI |
| Utility | Lombok |

---

# 📂 Project Structure

```
src/main/java/com/example/moviebooking

├── config
├── controller
├── dto
│   ├── request
│   ├── response
│   └── ApiResponse
├── entity
│   ├── Booking
│   ├── Cinema
│   ├── Movie
│   ├── Payment
│   ├── Room
│   ├── Seat
│   ├── SeatLock
│   ├── Showtime
│   ├── Ticket
│   └── User
├── exception
├── repository
├── scheduler
├── security
├── service
└── MovieBookingApplication
```

Each package has a dedicated responsibility, making the project easier to maintain, extend, and test.
