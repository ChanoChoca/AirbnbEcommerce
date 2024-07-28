package org.project.airbnb.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;
import org.project.airbnb.listing.application.dto.vo.DescriptionVO;
import org.project.airbnb.listing.application.dto.vo.TitleVO;

public record DescriptionDTO(
        @NotNull TitleVO title,
        @NotNull DescriptionVO description
        ) {
}
