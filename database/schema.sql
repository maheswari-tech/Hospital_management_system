-- ============================================================
-- Hospital Appointment System - Database Schema
-- Run this in phpMyAdmin or MySQL CLI (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- Spring Boot JPA will auto-create tables with ddl-auto=update
-- But if you prefer manual setup, use this script:

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL DEFAULT 'PATIENT',
    specialization VARCHAR(255),
    phone VARCHAR(50),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

CREATE TABLE IF NOT EXISTS available_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_doctor_date (doctor_id, date)
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'BOOKED',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_status (status)
);

-- ============================================================
-- SEED DATA (Optional - for testing)
-- Password for all users: "password123" (BCrypt hashed)
-- ============================================================

-- Admin User (password: password123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'ADMIN');

-- Sample Doctors (password: password123)
INSERT IGNORE INTO users (name, email, password, role, specialization, phone) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'DOCTOR', 'Cardiology', '+1-555-0101'),
('Dr. Michael Chen', 'michael.chen@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'DOCTOR', 'Neurology', '+1-555-0102'),
('Dr. Priya Patel', 'priya.patel@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'DOCTOR', 'Orthopedics', '+1-555-0103'),
('Dr. James Williams', 'james.williams@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'DOCTOR', 'Dermatology', '+1-555-0104');

-- Sample Patient (password: password123)
INSERT IGNORE INTO users (name, email, password, role, phone) VALUES
('John Patient', 'patient@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFkFj.wJ1tZFJEbFhQrG/e', 'PATIENT', '+1-555-0200');
