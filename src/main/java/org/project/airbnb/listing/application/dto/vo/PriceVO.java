package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el precio de un listado.
 */
public record PriceVO(
        @NotNull(message = "Price value must be present") int value // Precio del listado, no puede ser nulo.
) {
}
