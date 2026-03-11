package com.hospital.service;

import com.hospital.dto.DTOs.*;
import com.hospital.model.Appointment;
import com.hospital.model.Appointment.AppointmentStatus;
import com.hospital.model.AvailableSlot;
import com.hospital.model.User;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.AvailableSlotRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailableSlotRepository slotRepository;

    @Transactional
    public AppointmentResponse bookAppointment(Long patientId, BookAppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getRole() != User.Role.DOCTOR) {
            throw new RuntimeException("Selected user is not a doctor");
        }

        // Business Rule: Check doctor availability slot
        List<AvailableSlot> slots = slotRepository.findByDoctorIdAndDate(doctor.getId(), request.getAppointmentDate());
        boolean doctorAvailable = slots.stream().anyMatch(slot ->
                !slot.getStartTime().isAfter(request.getStartTime()) &&
                !slot.getEndTime().isBefore(request.getEndTime())
        );
        if (!doctorAvailable) {
            throw new RuntimeException("Doctor is not available at the selected time");
        }

        // Business Rule: No overlapping doctor appointments
        List<Appointment> doctorOverlaps = appointmentRepository.findOverlappingDoctorAppointments(
                doctor.getId(), request.getAppointmentDate(), request.getStartTime(), request.getEndTime());
        if (!doctorOverlaps.isEmpty()) {
            throw new RuntimeException("Doctor already has an appointment at this time");
        }

        // Business Rule: No overlapping patient appointments
        List<Appointment> patientOverlaps = appointmentRepository.findOverlappingPatientAppointments(
                patientId, request.getAppointmentDate(), request.getStartTime(), request.getEndTime());
        if (!patientOverlaps.isEmpty()) {
            throw new RuntimeException("You already have an appointment at this time");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .notes(request.getNotes())
                .status(AppointmentStatus.BOOKED)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return toResponse(saved);
    }

    // Only DOCTOR can confirm
    @Transactional
    public AppointmentResponse confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can confirm this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException("Only BOOKED appointments can be confirmed");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return toResponse(appointmentRepository.save(appointment));
    }

    // Only ADMIN can cancel after confirmation
    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long userId, String role) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.BOOKED && 
            appointment.getPatient().getId().equals(userId)) {
            // Patient can cancel their own BOOKED appointments
        } else if ("ADMIN".equals(role)) {
            // Admin can cancel any appointment
        } else {
            throw new RuntimeException("Only ADMIN can cancel confirmed appointments");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse completeAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can complete this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Only CONFIRMED appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return toResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getName())
                .doctorSpecialization(a.getDoctor().getSpecialization())
                .appointmentDate(a.getAppointmentDate())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
