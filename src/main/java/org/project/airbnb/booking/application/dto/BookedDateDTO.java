package org.project.airbnb.booking.application.dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

/**
 * BookedDateDTO es un objeto de transferencia de datos (DTO) que representa
 * un intervalo de fechas reservado. Utiliza el patrón Record de Java para
 * crear una clase inmutable con dos campos: startDate y endDate.
 */
public record BookedDateDTO(
        // La fecha y hora de inicio de la reserva. No puede ser nula.
        @NotNull OffsetDateTime startDate,

        // La fecha y hora de fin de la reserva. No puede ser nula.
        @NotNull OffsetDateTime endDate
) {
}