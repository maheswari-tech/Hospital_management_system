package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);

    // Check for overlapping appointments for a doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    List<Appointment> findOverlappingDoctorAppointments(
        @Param("doctorId") Long doctorId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    // Check for overlapping appointments for a patient
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    List<Appointment> findOverlappingPatientAppointments(
        @Param("patientId") Long patientId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    // Aggregation: appointments per doctor
    @Query("SELECT a.doctor.id, a.doctor.name, COUNT(a) as total FROM Appointment a " +
           "GROUP BY a.doctor.id, a.doctor.name ORDER BY total DESC")
    List<Object[]> countAppointmentsPerDoctor();

    // Aggregation: appointments by status
    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countAppointmentsByStatus();

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
}
