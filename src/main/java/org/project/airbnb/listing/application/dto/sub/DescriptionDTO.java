package org.project.airbnb.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;
import org.project.airbnb.listing.application.dto.vo.DescriptionVO;
import org.project.airbnb.listing.application.dto.vo.TitleVO;

/**
 * DTO para la descripción de un listado, que contiene un título y una descripción.
 */
public record DescriptionDTO(
        @NotNull TitleVO title, // El título no puede ser nulo.
        @NotNull DescriptionVO description // La descripción no puede ser nula.
) {
}
