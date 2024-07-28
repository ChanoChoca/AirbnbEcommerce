package org.project.airbnb.listing.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.listing.application.dto.sub.ListingInfoDTO;

public record SearchDTO(@Valid BookedDateDTO dates,
                        @Valid ListingInfoDTO infos,
                        @NotEmpty String location) {
}
