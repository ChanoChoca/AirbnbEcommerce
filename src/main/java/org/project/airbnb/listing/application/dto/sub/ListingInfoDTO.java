package org.project.airbnb.listing.application.dto.sub;

import org.project.airbnb.listing.application.dto.vo.BathsVO;
import org.project.airbnb.listing.application.dto.vo.BedroomsVO;
import org.project.airbnb.listing.application.dto.vo.BedsVO;
import org.project.airbnb.listing.application.dto.vo.GuestsVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para la información detallada de un listado.
 */
public record ListingInfoDTO(
        @NotNull @Valid GuestsVO guests,   // Número de huéspedes permitido. No puede ser nulo.
        @NotNull @Valid BedroomsVO bedrooms, // Número de dormitorios. No puede ser nulo.
        @NotNull @Valid BedsVO beds,         // Número de camas. No puede ser nulo.
        @NotNull @Valid BathsVO baths) {     // Número de baños. No puede ser nulo.
}
