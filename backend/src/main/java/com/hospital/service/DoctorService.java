package com.hospital.service;

import com.hospital.dto.DTOs.*;
import com.hospital.model.AvailableSlot;
import com.hospital.model.User;
import com.hospital.repository.AvailableSlotRepository;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailableSlotRepository slotRepository;

    public List<DoctorResponse> searchDoctors(String specialization) {
        List<User> doctors;
        if (specialization != null && !specialization.isEmpty()) {
            doctors = userRepository.findDoctorsBySpecialization(specialization);
        } else {
            doctors = userRepository.findByRole(User.Role.DOCTOR);
        }
        return doctors.stream().map(this::toDoctorResponse).collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return toDoctorResponse(doctor);
    }

    @Transactional
    public SlotResponse addAvailableSlot(Long doctorId, SlotRequest request) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        AvailableSlot slot = AvailableSlot.builder()
                .doctor(doctor)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        AvailableSlot saved = slotRepository.save(slot);
        return SlotResponse.builder()
                .id(saved.getId())
                .date(saved.getDate())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .build();
    }

    @Transactional
    public void deleteSlot(Long slotId, Long doctorId) {
        AvailableSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        if (!slot.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized");
        }
        slotRepository.delete(slot);
    }

    public List<SlotResponse> getDoctorSlots(Long doctorId) {
        return slotRepository.findByDoctorId(doctorId).stream()
                .map(s -> SlotResponse.builder()
                        .id(s.getId())
                        .date(s.getDate())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .build())
                .collect(Collectors.toList());
    }

    private DoctorResponse toDoctorResponse(User doctor) {
        List<SlotResponse> slots = slotRepository.findByDoctorId(doctor.getId())
                .stream()
                .map(s -> SlotResponse.builder()
                        .id(s.getId())
                        .date(s.getDate())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .build())
                .collect(Collectors.toList());

        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .specialization(doctor.getSpecialization())
                .phone(doctor.getPhone())
                .availableSlots(slots)
                .build();
    }
}
