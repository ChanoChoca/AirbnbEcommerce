package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar la descripción de un listado.
 */
public record DescriptionVO(
        @NotNull(message = "Description value must be present") String value // Descripción, no puede ser nula.
) {
}
