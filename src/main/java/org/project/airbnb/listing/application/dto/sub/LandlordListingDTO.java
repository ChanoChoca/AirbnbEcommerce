package org.project.airbnb.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para la información de un arrendador en un listado.
 */
public record LandlordListingDTO(
        @NotNull String firstname, // El nombre del arrendador no puede ser nulo.
        @NotNull String imageUrl   // La URL de la imagen del arrendador no puede ser nula.
) {
}
