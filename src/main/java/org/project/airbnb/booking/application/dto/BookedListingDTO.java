package org.project.airbnb.booking.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.application.dto.vo.PriceVO;

import java.util.UUID;

/**
 * BookedListingDTO es un objeto de transferencia de datos (DTO) que representa
 * una reserva de un listado en Airbnb. Utiliza el patrón Record de Java para
 * crear una clase inmutable con varios campos relacionados con la reserva.
 */
public record BookedListingDTO(
        // La imagen de portada del listado reservado. Debe ser válida.
        @Valid PictureDTO cover,

        // La ubicación del listado reservado. No puede estar vacía.
        @NotEmpty String location,

        // Las fechas de la reserva. Deben ser válidas.
        @Valid BookedDateDTO dates,

        // El precio total de la reserva. Debe ser válido.
        @Valid PriceVO totalPrice,

        // El identificador público de la reserva. No puede ser nulo.
        @NotNull UUID bookingPublicId,

        // El identificador público del listado reservado. No puede ser nulo.
        @NotNull UUID listingPublicId
) {
}
