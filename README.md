# 🚗 RidePool — Pool your ride, Split the cost

> A full-stack ride pooling web application where vehicle owners share rides and commuters split only the **fuel + toll cost** — no profit, no platform fee, just fair sharing.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?style=flat&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat&logo=firebase)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-yellow?style=flat)
![Vite](https://img.shields.io/badge/Frontend-Vite-purple?style=flat&logo=vite)

---

## 📌 About

RidePool is inspired by BlaBlaCar but built for **Indian students and daily commuters** in semi-urban and rural areas. Unlike BlaBlaCar, RidePool charges **zero platform commission** — riders only recover their fuel and toll costs, making it genuinely affordable for everyone.

---

## ✨ Features

### 👤 User Management
- Register / Login with Firebase Authentication
- Role-based access — **Rider** (offers ride) & **Commuter** (books ride)
- Profile with photo, vehicle details, license, and rating score
- ID / License verification badge
- Trusted contact for trip sharing

### 🚗 Ride Posting
- Post rides with source, destination, date, time, and available seats
- Support for bikes and cars
- Mark toll routes, women-only rides
- Recurring rides — daily / weekly (auto-created by scheduler at 1 AM)
- Edit or cancel posted rides

### 🔍 Ride Search
- Search by source, destination, date, and seats
- Filter by vehicle type, min rating, women-only
- Fare preview before booking
- View rider profile and verification status

### 📋 Booking System
- Booking lifecycle → `PENDING → CONFIRMED → COMPLETED`
- OTP-based trip start confirmation (valid 30 minutes)
- Auto-cancel pending bookings after 15 minutes (Spring scheduled job)
- Real-time seat availability update

### 💰 Smart Fare Splitting
```
Fare Per Seat = (Distance × Fuel Rate per KM + Toll Cost) ÷ Total Seats
```
- Distance auto-calculated via Google Maps API
- Fuel rate configurable by Admin from database
- Fare preview before booking
- Shareable receipt after trip completion

### 📍 Live Location & Tracking
- Real-time rider GPS broadcast via WebSocket
- Commuter tracks rider approaching pickup
- Trip start/end location logging

### 💬 In-App Chat
- WebSocket STOMP based real-time chat per ride
- Firebase chat fallback support
- Chat auto-disabled on trip completion

### 🛡️ Safety Features
- OTP trip confirmation
- SOS emergency alert with live location
- Women-only ride filter
- Profile verification badges
- Trip sharing with trusted contact

### 🌱 Eco & Community Impact
- CO₂ savings auto-calculated on trip completion (`0.2 kg per seat`)
- Fuel saved tracker per user
- Karma points for frequent ride-givers
- Community leaderboard (top riders by karma + CO₂)

### 📊 Dashboard & History
- Rider dashboard — posted rides, cost offset, ratings
- Commuter dashboard — booked rides, money saved, CO₂ saved
- Trip history with fare breakdown
- Weekly / monthly ride stats

### 🔧 Admin Panel
- Manage users — verify / block
- Monitor reports and flags
- Platform analytics — user growth, ride volume, total CO₂ saved
- Live fuel rate configuration stored in database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + CSS + JavaScript (Vite) |
| Backend | Java (Spring Boot 3.2) |
| Database | MySQL 8.0 |
| Authentication | Firebase Auth + JWT |
| Maps & Routes | Google Maps API |
| Live Location | WebSocket (STOMP) |
| Real-time Chat | WebSocket + Firebase |
| Notifications | Firebase Cloud Messaging (FCM) |
| Scheduled Jobs | Spring @Scheduled |
| Load Testing | Apache JMeter |

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `users` | All registered users with roles |
| `rides` | Posted rides with recurrence info |
| `bookings` | Seat reservations with OTP & lifecycle |
| `fare_details` | Cost breakdown per trip |
| `reviews` | Ratings and written reviews |
| `reports` | User complaints and flags |
| `eco_tracker` | CO₂ and fuel savings per user |
| `karma_points` | Reward points for ride-givers |
| `platform_config` | Admin-controlled fuel rate and toll config |

---

## 🔌 API Overview

40+ REST APIs across 13 modules:

| Module | Key Endpoints |
|---|---|
| Auth | `POST /api/auth/firebase-login` |
| Users | `GET /api/users/{id}`, `PUT /api/users/me` |
| Rides | `POST /api/rides`, `GET /api/rides/search`, `PATCH /api/rides/{id}/cancel` |
| Bookings | `POST /api/bookings`, `PATCH /api/bookings/{id}/confirm`, `POST /api/bookings/{id}/verify-otp` |
| Fare | `POST /api/fare/preview`, `GET /api/bookings/{id}/receipt` |
| Reviews | `POST /api/reviews`, `GET /api/reviews/user/{userId}` |
| Reports | `POST /api/reports`, `GET /api/reports/my` |
| Stats | `GET /api/stats/dashboard`, `GET /api/stats/leaderboard` |
| Admin | `GET /api/admin/users`, `PATCH /api/admin/users/{id}/verify`, `PUT /api/admin/config/fuel-rate` |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- MySQL 8.0+
- Node.js 18+
- Firebase project

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ridepool.git

# Navigate to backend
cd backend

# Configure database in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ridepool
spring.datasource.username=your_username
spring.datasource.password=your_password

# Run the backend
.\mvnw.cmd spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

Open → `http://localhost:5173`

---

## 📊 Project Stats

| | |
|---|---|
| 🧩 Total Modules | 13 |
| 🔌 REST API Endpoints | 40+ |
| 🗄️ Database Tables | 9 |
| 🛠️ Technologies | 10+ |
| 👥 Concurrent Users Tested | 50+ |
| 📈 SQL Query Optimization | 20–25% performance gain |

---

## 👨‍💻 Author

**Sathwik** — 3rd Year B.Tech Student  
[GitHub](https://github.com/sathwik466)

---

## 📄 License

This project is for educational purposes.
