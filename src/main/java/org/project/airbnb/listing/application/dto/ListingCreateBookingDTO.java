package org.project.airbnb.listing.application.dto;

import org.project.airbnb.listing.application.dto.vo.PriceVO;

import java.util.UUID;


/**
 * DTO para la creación de una reserva de listado.
 */
public record ListingCreateBookingDTO(
        UUID listingPublicId, PriceVO price) {
}
// Identificador público del listado
// Precio de la reserva
