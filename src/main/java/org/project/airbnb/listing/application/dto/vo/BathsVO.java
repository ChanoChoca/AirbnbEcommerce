package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el número de baños en un listado.
 */
public record BathsVO(
        @NotNull(message = "Bath value must be present") int value // Número de baños, no puede ser nulo.
) {
}
