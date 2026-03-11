package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(MessageResponse.builder().message("User deleted").success(true).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(MessageResponse.builder().message(e.getMessage()).success(false).build());
        }
    }
}
