package org.project.airbnb.booking.application.dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * NewBookingDTO es un objeto de transferencia de datos (DTO) que representa
 * una nueva reserva que se desea realizar en Airbnb. Utiliza el patrón Record
 * de Java para crear una clase inmutable con los campos necesarios para crear
 * una nueva reserva.
 */
public record NewBookingDTO(
        // La fecha y hora de inicio de la nueva reserva. No puede ser nula.
        @NotNull OffsetDateTime startDate,

        // La fecha y hora de fin de la nueva reserva. No puede ser nula.
        @NotNull OffsetDateTime endDate,

        // El identificador público del listado que se desea reservar. No puede ser nulo.
        @NotNull UUID listingPublicId
) {
}
