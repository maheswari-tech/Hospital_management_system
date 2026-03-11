package com.hospital.controller;

import com.hospital.config.JwtUtils;
import com.hospital.dto.DTOs.*;
import com.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private JwtUtils jwtUtils;

    private Long getUserId(Authentication auth) {
        return (Long) auth.getDetails();
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@RequestBody BookAppointmentRequest request,
                                              Authentication auth) {
        try {
            return ResponseEntity.ok(appointmentService.bookAppointment(getUserId(auth), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(appointmentService.confirmAppointment(id, getUserId(auth)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(appointmentService.cancelAppointment(id, getUserId(auth), getRole(auth)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, Authentication auth) {
        try {
            return ResponseEntity.ok(appointmentService.completeAppointment(id, getUserId(auth)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(Authentication auth) {
        String role = getRole(auth);
        Long userId = getUserId(auth);
        if ("PATIENT".equals(role)) {
            return ResponseEntity.ok(appointmentService.getPatientAppointments(userId));
        } else if ("DOCTOR".equals(role)) {
            return ResponseEntity.ok(appointmentService.getDoctorAppointments(userId));
        } else {
            return ResponseEntity.ok(appointmentService.getAllAppointments());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}
