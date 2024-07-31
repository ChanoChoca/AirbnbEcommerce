package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el número de camas en un listado.
 */
public record BedsVO(
        @NotNull(message = "beds value must be present") int value // Número de camas, no puede ser nulo.
) {
}
