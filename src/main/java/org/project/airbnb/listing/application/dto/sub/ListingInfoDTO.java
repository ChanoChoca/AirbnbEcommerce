package org.project.airbnb.listing.application.dto.sub;

import org.project.airbnb.listing.application.dto.vo.BathsVO;
import org.project.airbnb.listing.application.dto.vo.BedroomsVO;
import org.project.airbnb.listing.application.dto.vo.BedsVO;
import org.project.airbnb.listing.application.dto.vo.GuestsVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ListingInfoDTO(
        @NotNull @Valid GuestsVO guests,
        @NotNull @Valid BedroomsVO bedrooms,
        @NotNull @Valid BedsVO beds,
        @NotNull @Valid BathsVO baths) {
}
