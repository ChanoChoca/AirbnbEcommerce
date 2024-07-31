package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el número de huéspedes de un listado.
 */
public record GuestsVO(
        @NotNull(message = "Guests value must be present") int value // Número de huéspedes, no puede ser nulo.
) {
}
