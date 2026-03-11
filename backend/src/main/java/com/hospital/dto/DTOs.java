package com.hospital.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.hospital.model.Appointment;
import com.hospital.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class DTOs {

    // Auth
    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role; // ADMIN, DOCTOR, PATIENT
        private String specialization;
        private String phone;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private String role;
        private String specialization;
    }

    // Appointment
    @Data
    public static class BookAppointmentRequest {
        private Long doctorId;
        private LocalDate appointmentDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String notes;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AppointmentResponse {
        private Long id;
        private Long patientId;
        private String patientName;
        private Long doctorId;
        private String doctorName;
        private String doctorSpecialization;
        private LocalDate appointmentDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Appointment.AppointmentStatus status;
        private String notes;
        private LocalDateTime createdAt;
    }

    // Slot
    @Data
    public static class SlotRequest {
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SlotResponse {
        private Long id;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    // Doctor
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DoctorResponse {
        private Long id;
        private String name;
        private String email;
        private String specialization;
        private String phone;
        private List<SlotResponse> availableSlots;
    }

    // Admin stats
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StatsResponse {
        private long totalDoctors;
        private long totalPatients;
        private long totalAppointments;
        private long bookedCount;
        private long confirmedCount;
        private long completedCount;
        private long cancelledCount;
        private List<DoctorAppointmentCount> appointmentsPerDoctor;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DoctorAppointmentCount {
        private Long doctorId;
        private String doctorName;
        private Long count;
    }

    // Generic message response
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MessageResponse {
        private String message;
        private boolean success;
    }
}
