# CareConnect : AI-Powered Healthcare Management Platform 🏥

### Introduction

CareConnect is a modern healthcare platform that simplifies doctor appointment booking, communication, and prescription management. Patients can book appointments, make secure online payments, chat with doctors in real time, and access digital prescriptions, while doctors can efficiently manage consultations with AI-powered assistance.

---

# The Problem

Traditional appointment systems are often inefficient, leading to scheduling conflicts, manual paperwork, poor communication, and a lack of transparency in doctor availability. Patients also struggle to securely manage appointments, payments, and medical records in one place.

---

# Our Solution

CareConnect digitizes the entire healthcare workflow—from appointment booking and online payments to real-time consultations and digital prescriptions. With admin-verified doctors, intelligent scheduling, AI assistance, and secure communication, the platform provides a seamless healthcare experience for both patients and doctors.

---

# Key Features

### 👥 Multi-Role Authentication

* Patient Login & Signup
* Doctor Login & Registration
* Admin Login
* Admin Approval Required for Doctor Verification

### 📅 Appointment Booking

* Browse Verified Doctors
* Select Available Time Slots
* Book Appointments Online
* Doctor Approval Before Final Confirmation

### 💳 Razorpay Integration

* Secure Online Payments
* Instant Payment Verification
* Slot Reservation After Payment

### ⚡ Conflict Avoidance System

* Prevents Double Booking
* Automatically Blocks Reserved Slots
* Ensures Appointment Consistency
* Avoids Scheduling Conflicts

### 💬 Real-Time Consultation Chat

* Socket.IO Powered Messaging
* Instant Doctor-Patient Communication
* Appointment-Based Conversations

### 📄 Digital Prescription System

* Doctors Generate Prescriptions Online
* Patients View Prescriptions Anytime
* Download Prescriptions as PDF

### 🤖 AI Healthcare Assistant

Powered by Gemini API

* Healthcare Guidance
* Doctor Assistance & Suggestions
* Intelligent Patient Support

### 🩺 Doctor Application Portal
* Enables healthcare professionals to apply, register, and join the platform through a structured application process
* Admin-driven verification process ensures authenticity
  
### 📧 Email Confirmation System
* Automatic Gmail notifications for appointment bookings and status updates.

---

### Tech Stack

Frontend: React.js, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT, bcrypt.js

Real-Time Communication: Socket.IO

Payments: Razorpay

Cloud Storage: Cloudinary, Multer

AI Integration: Google Gemini API

---

# Workflow

```text
Patient Signup/Login
         ↓
Browse Doctors
         ↓
Book Appointment
         ↓
Razorpay Payment
         ↓
Slot Reserved
         ↓
Doctor Accepts Request
         ↓
Real-Time Chat
         ↓
Digital Prescription
         ↓
PDF Download
```

---

#  Key Highlights 🌟

* Admin-Verified Doctors
* Real-Time Doctor-Patient Chat
* AI-Powered Healthcare Assistance
* Digital Prescription Management
* Secure Razorpay Payments
* **Smart Conflict Avoidance System**
* End-to-End Healthcare Digitization

---

# Installation / Quickstart

```bash
git clone https://github.com/Akriti321/CareConnect.git

cd frontend
npm install

cd admin
npm install

cd backend
npm install

# Add .env Variables

MONGODB_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
GEMINI_API_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=


npm run server
npm run dev
```


### Connecting Patients, Doctors, and AI for Smarter Healthcare 🚀
