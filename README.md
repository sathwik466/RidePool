# 🚗 RidePool — Pool Your Ride, Split the Cost

A full-stack ride-pooling web application where vehicle owners share rides and commuters split only the fuel and toll cost—no profit, no platform fee, just fair cost sharing.

**Tech Stack:** Spring Boot • React • TypeScript • MySQL • JWT • WebSocket • Google Maps API • Vite

---

# 📌 About

RidePool is inspired by BlaBlaCar but designed for Indian students and daily commuters in semi-urban and rural areas. Unlike commercial ride-sharing platforms, RidePool charges **zero platform commission**. Riders recover only their fuel and toll expenses, making travel more affordable, sustainable, and community-driven.

---

# ✨ Features

## 👤 User Management

* Register/Login using Email & Password
* **Mandatory Email OTP verification** during registration
* JWT-based Authentication
* Role-based access (Rider & Commuter)
* User profile with photo, vehicle details, driving license, and ratings
* ID/License verification badge
* Trusted emergency contact

---

## 🚗 Ride Posting

* Post rides with source, destination, date, time, and available seats
* Bike and Car ride support
* Women-only rides
* Toll route support
* Recurring rides (Daily/Weekly)
* Scheduler automatically creates recurring rides at **1:00 AM**
* Edit or cancel rides

---

## 🔍 Ride Search

* Search rides by source, destination, date, and seats
* Filter by:

  * Vehicle type
  * Minimum rider rating
  * Women-only rides
* Fare preview before booking
* View rider profile and verification status

---

## 📋 Booking System

* Booking lifecycle:

  * PENDING
  * CONFIRMED
  * COMPLETED
* Email OTP verification before trip starts
* OTP valid for 30 minutes
* Auto-cancel pending bookings after 15 minutes using Spring Scheduler
* Real-time seat availability updates

---

## 💰 Smart Fare Splitting

Fare Per Seat =

```
(Distance × Fuel Rate per KM + Toll Cost)
------------------------------------------
           Total Available Seats
```

* Distance calculated using Google Maps API
* Fuel rate configurable by Admin
* Fare preview before booking
* Downloadable trip receipt

---

## 📍 Live Location Tracking

* Rider GPS broadcast using WebSocket (STOMP)
* Live tracking for commuters
* Trip start/end location logging

---

## 💬 Real-Time Chat

* WebSocket (STOMP)-based ride chat
* One chat room per ride
* Chat disabled automatically after ride completion

---

## 🛡️ Safety Features

* Email OTP verification
* SOS emergency alert
* Women-only rides
* Verified rider badges
* Trip sharing with trusted contacts

---

## 🌱 Eco & Community Impact

* Automatic CO₂ savings calculation
* Fuel savings tracker
* Karma points for frequent ride providers
* Community leaderboard

---

## 📊 Dashboard & History

### Rider Dashboard

* Posted rides
* Cost recovered
* Ratings received
* Monthly ride statistics

### Commuter Dashboard

* Booked rides
* Money saved
* CO₂ saved
* Ride history

---

## 🔧 Admin Panel

* Verify or block users
* Manage reports
* Platform analytics
* Configure live fuel rate
* Monitor overall ride statistics

---

# 🛠️ Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Frontend       | React + TypeScript + Vite + Tailwind CSS |
| Backend        | Java 17 + Spring Boot 3                  |
| Database       | MySQL 8                                  |
| Authentication | JWT + Spring Security                    |
| Maps           | Google Maps API                          |
| Live Location  | WebSocket (STOMP)                        |
| Chat           | WebSocket (STOMP)                        |
| Email Service  | Spring Mail (OTP Verification)           |
| Scheduled Jobs | Spring Scheduler                         |
| Load Testing   | Apache JMeter                            |

---

# 🗄️ Database Schema

| Table           | Purpose                       |
| --------------- | ----------------------------- |
| users           | User accounts and roles       |
| rides           | Ride information              |
| bookings        | Ride bookings with OTP status |
| fare_details    | Fare calculation and receipt  |
| reviews         | User ratings and reviews      |
| reports         | User complaints               |
| eco_tracker     | CO₂ and fuel savings          |
| karma_points    | Reward points                 |
| platform_config | Fuel rate configuration       |

---

# 🔌 API Overview

More than **40 REST APIs** across multiple modules.

| Module         | Key Endpoints                                                                             |
| -------------- | ----------------------------------------------------------------------------------------- |
| Authentication | POST /api/auth/register, POST /api/auth/login, POST /api/auth/verify-email-otp            |
| Users          | GET /api/users/{id}, PUT /api/users/me                                                    |
| Rides          | POST /api/rides, GET /api/rides/search, PATCH /api/rides/{id}/cancel                      |
| Bookings       | POST /api/bookings, PATCH /api/bookings/{id}/confirm, POST /api/bookings/{id}/verify-otp  |
| Fare           | POST /api/fare/preview, GET /api/bookings/{id}/receipt                                    |
| Reviews        | POST /api/reviews, GET /api/reviews/user/{userId}                                         |
| Reports        | POST /api/reports, GET /api/reports/my                                                    |
| Statistics     | GET /api/stats/dashboard, GET /api/stats/leaderboard                                      |
| Admin          | GET /api/admin/users, PATCH /api/admin/users/{id}/verify, PUT /api/admin/config/fuel-rate |

---

# 🚀 Getting Started

## Prerequisites

* Java 17+
* MySQL 8+
* Node.js 18+
* Google Maps API Key

---

## Backend Setup

```bash
git clone https://github.com/yourusername/ridepool.git

cd backend

# Configure application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/ridepool
spring.datasource.username=your_username
spring.datasource.password=your_password

./mvnw spring-boot:run
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open:

```
http://localhost:5173
```

---

# 📊 Project Stats

| Metric                  | Value                          |
| ----------------------- | ------------------------------ |
| Modules                 | 13                             |
| REST APIs               | 40+                            |
| Database Tables         | 9                              |
| Technologies Used       | 10+                            |
| Concurrent Users Tested | 50+                            |
| SQL Query Optimization  | 20–25% Performance Improvement |

---

# 👨‍💻 Author

**Sathwik Thuppathuri**

B.Tech (3rd Year) – CVR College of Engineering

---

# 📄 License

This project is developed for educational and learning purposes.
