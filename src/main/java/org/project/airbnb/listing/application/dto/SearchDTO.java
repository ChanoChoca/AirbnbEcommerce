package org.project.airbnb.listing.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.listing.application.dto.sub.ListingInfoDTO;

/**
 * DTO utilizado para realizar una búsqueda de listados.
 */
public record SearchDTO(
        @Valid BookedDateDTO dates, // Fechas de reserva validadas
        @Valid ListingInfoDTO infos, // Información del listado validada
        @NotEmpty String location) { // Ubicación, no puede estar vacío

}
