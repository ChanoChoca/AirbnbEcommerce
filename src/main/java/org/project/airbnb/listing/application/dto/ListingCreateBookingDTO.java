package org.project.airbnb.listing.application.dto;

import org.project.airbnb.listing.application.dto.vo.PriceVO;

import java.util.UUID;

public record ListingCreateBookingDTO(
        UUID listingPublicId, PriceVO price) {
}
