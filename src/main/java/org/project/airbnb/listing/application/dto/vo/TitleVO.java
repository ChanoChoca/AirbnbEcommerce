package org.project.airbnb.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

/**
 * Valor objeto para representar el título de un listado.
 */
public record TitleVO(
        @NotNull(message = "Title value must be present") String value // Título del listado, no puede ser nulo.
) {
}
