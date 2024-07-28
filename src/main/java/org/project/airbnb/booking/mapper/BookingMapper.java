package org.project.airbnb.booking.mapper;

import org.mapstruct.Mapper;
import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.booking.application.dto.NewBookingDTO;
import org.project.airbnb.booking.domain.Booking;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    Booking newBookingToBooking(NewBookingDTO newBookingDTO);

    BookedDateDTO bookingToCheckAvailability(Booking booking);
}
