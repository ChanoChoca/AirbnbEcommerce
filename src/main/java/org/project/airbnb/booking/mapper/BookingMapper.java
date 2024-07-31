package org.project.airbnb.booking.mapper;

import org.mapstruct.Mapper;
import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.booking.application.dto.NewBookingDTO;
import org.project.airbnb.booking.domain.Booking;

/**
 * BookingMapper es una interfaz que utiliza MapStruct para generar automáticamente
 * implementaciones de los métodos de mapeo entre diferentes tipos de objetos.
 * El componente se configura para ser un bean de Spring.
 */
@Mapper(componentModel = "spring")
public interface BookingMapper {

    /**
     * Convierte un objeto NewBookingDTO a un objeto Booking.
     *
     * @param newBookingDTO el DTO que contiene la información de una nueva reserva.
     * @return una entidad Booking que representa la nueva reserva.
     */
    Booking newBookingToBooking(NewBookingDTO newBookingDTO);

    /**
     * Convierte un objeto Booking a un BookedDateDTO para verificar la disponibilidad.
     *
     * @param booking la entidad Booking que se va a convertir.
     * @return un DTO que contiene las fechas de la reserva.
     */
    BookedDateDTO bookingToCheckAvailability(Booking booking);
}
