package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/search")
    public ResponseEntity<?> searchDoctors(@RequestParam(required = false) String specialization) {
        return ResponseEntity.ok(doctorService.searchDoctors(specialization));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorSlots(id));
    }

    @PostMapping("/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addSlot(@RequestBody SlotRequest request, Authentication auth) {
        try {
            Long doctorId = (Long) auth.getDetails();
            return ResponseEntity.ok(doctorService.addAvailableSlot(doctorId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }

    @DeleteMapping("/slots/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId, Authentication auth) {
        try {
            Long doctorId = (Long) auth.getDetails();
            doctorService.deleteSlot(slotId, doctorId);
            return ResponseEntity.ok(MessageResponse.builder().message("Slot deleted").success(true).build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }
}
