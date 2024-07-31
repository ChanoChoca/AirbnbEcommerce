package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el número de dormitorios en un listado.
 */
public record BedroomsVO(
        @NotNull(message = "Bedroom value must be present") int value // Número de dormitorios, no puede ser nulo.
) {
}
