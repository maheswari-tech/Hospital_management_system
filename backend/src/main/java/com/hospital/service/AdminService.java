package com.hospital.service;

import com.hospital.dto.DTOs.*;
import com.hospital.model.User;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public StatsResponse getStats() {
        long totalDoctors = userRepository.findByRole(User.Role.DOCTOR).size();
        long totalPatients = userRepository.findByRole(User.Role.PATIENT).size();
        long totalAppointments = appointmentRepository.count();

        long booked = 0, confirmed = 0, completed = 0, cancelled = 0;
        for (Object[] row : appointmentRepository.countAppointmentsByStatus()) {
            String status = row[0].toString();
            long count = ((Number) row[1]).longValue();
            switch (status) {
                case "BOOKED" -> booked = count;
                case "CONFIRMED" -> confirmed = count;
                case "COMPLETED" -> completed = count;
                case "CANCELLED" -> cancelled = count;
            }
        }

        List<DoctorAppointmentCount> perDoctor = appointmentRepository.countAppointmentsPerDoctor()
                .stream()
                .map(row -> DoctorAppointmentCount.builder()
                        .doctorId(((Number) row[0]).longValue())
                        .doctorName((String) row[1])
                        .count(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        return StatsResponse.builder()
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .totalAppointments(totalAppointments)
                .bookedCount(booked)
                .confirmedCount(confirmed)
                .completedCount(completed)
                .cancelledCount(cancelled)
                .appointmentsPerDoctor(perDoctor)
                .build();
    }

    public List<DoctorResponse> getAllDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR)
                .stream()
                .map(u -> DoctorResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .specialization(u.getSpecialization())
                        .phone(u.getPhone())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
