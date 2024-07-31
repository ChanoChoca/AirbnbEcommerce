package org.project.airbnb.listing.application.dto;

import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.application.dto.vo.PriceVO;
import org.project.airbnb.listing.domain.BookingCategory;

import java.util.UUID;

/**
 * DTO (Data Transfer Object) para representar la información de un listado en una tarjeta de presentación.
 */
public record DisplayCardListingDTO(
        PriceVO price,                    // Precio del listado.
        String location,                 // Ubicación del listado.
        PictureDTO cover,                // Imagen de portada del listado.
        BookingCategory bookingCategory, // Categoría de reserva del listado.
        UUID publicId                    // Identificador público del listado.
) {
}
