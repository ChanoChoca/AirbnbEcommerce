package org.project.airbnb.booking.application;

import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.booking.application.dto.BookedListingDTO;
import org.project.airbnb.booking.application.dto.NewBookingDTO;
import org.project.airbnb.booking.domain.Booking;
import org.project.airbnb.booking.mapper.BookingMapper;
import org.project.airbnb.booking.repository.BookingRepository;
import org.project.airbnb.infrastructure.config.SecurityUtils;
import org.project.airbnb.listing.application.LandlordService;
import org.project.airbnb.listing.application.dto.DisplayCardListingDTO;
import org.project.airbnb.listing.application.dto.ListingCreateBookingDTO;
import org.project.airbnb.listing.application.dto.vo.PriceVO;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.user.application.UserService;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * BookingService es el servicio principal para gestionar las reservas en la aplicación.
 * Proporciona métodos para crear, cancelar y verificar la disponibilidad de las reservas.
 */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final UserService userService;
    private final LandlordService landlordService;

    /**
     * Constructor del servicio BookingService.
     *
     * @param bookingRepository el repositorio de reservas
     * @param bookingMapper el mapeador de reservas
     * @param userService el servicio de usuarios
     * @param landlordService el servicio de propietarios
     */
    public BookingService(BookingRepository bookingRepository, BookingMapper bookingMapper,
                          UserService userService, LandlordService landlordService) {
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
        this.userService = userService;
        this.landlordService = landlordService;
    }

    /**
     * Crea una nueva reserva basada en los datos proporcionados.
     *
     * @param newBookingDTO los datos de la nueva reserva
     * @return el estado de la operación
     */
    @Transactional
    public State<Void, String> create(NewBookingDTO newBookingDTO) {
        Booking booking = bookingMapper.newBookingToBooking(newBookingDTO);

        Optional<ListingCreateBookingDTO> listingOpt = landlordService.getByListingPublicId(newBookingDTO.listingPublicId());

        if (listingOpt.isEmpty()) {
            return State.<Void, String>builder().forError("Landlord public id not found");
        }

        boolean alreadyBooked = bookingRepository.bookingExistsAtInterval(newBookingDTO.startDate(), newBookingDTO.endDate(), newBookingDTO.listingPublicId());

        if (alreadyBooked) {
            return State.<Void, String>builder().forError("One booking already exists");
        }

        ListingCreateBookingDTO listingCreateBookingDTO = listingOpt.get();

        booking.setFkListing(listingCreateBookingDTO.listingPublicId());

        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        booking.setFkTenant(connectedUser.publicId());
        booking.setNumberOfTravelers(1);

        long numberOfNights = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
        booking.setTotalPrice((int) (numberOfNights * listingCreateBookingDTO.price().value()));

        bookingRepository.save(booking);

        return State.<Void, String>builder().forSuccess();
    }

    /**
     * Verifica la disponibilidad de un listado en función de su identificador público.
     *
     * @param publicId el identificador público del listado
     * @return una lista de BookedDateDTO que representa las fechas reservadas
     */
    @Transactional(readOnly = true)
    public List<BookedDateDTO> checkAvailability(UUID publicId) {
        return bookingRepository.findAllByFkListing(publicId)
                .stream().map(bookingMapper::bookingToCheckAvailability).toList();
    }

    /**
     * Obtiene todas las reservas realizadas por el usuario autenticado.
     *
     * @return una lista de BookedListingDTO que representa las reservas del usuario
     */
    @Transactional(readOnly = true)
    public List<BookedListingDTO> getBookedListing() {
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        List<Booking> allBookings = bookingRepository.findAllByFkTenant(connectedUser.publicId());
        List<UUID> allListingPublicIDs = allBookings.stream().map(Booking::getFkListing).toList();
        List<DisplayCardListingDTO> allListings = landlordService.getCardDisplayByListingPublicId(allListingPublicIDs);
        return mapBookingToBookedListing(allBookings, allListings);
    }

    /**
     * Mapea las reservas y los listados a BookedListingDTO.
     *
     * @param allBookings una lista de todas las reservas
     * @param allListings una lista de todos los listados
     * @return una lista de BookedListingDTO
     */
    private List<BookedListingDTO> mapBookingToBookedListing(List<Booking> allBookings, List<DisplayCardListingDTO> allListings) {
        return allBookings.stream().map(booking -> {
            DisplayCardListingDTO displayCardListingDTO = allListings
                    .stream()
                    .filter(listing -> listing.publicId().equals(booking.getFkListing()))
                    .findFirst()
                    .orElseThrow();
            BookedDateDTO dates = bookingMapper.bookingToCheckAvailability(booking);
            return new BookedListingDTO(displayCardListingDTO.cover(),
                    displayCardListingDTO.location(),
                    dates, new PriceVO(booking.getTotalPrice()),
                    booking.getPublicId(), displayCardListingDTO.publicId());
        }).toList();
    }

    /**
     * Cancela una reserva.
     *
     * @param bookingPublicId el identificador público de la reserva
     * @param listingPublicId el identificador público del listado
     * @param byLandlord indica si la cancelación la realiza el propietario
     * @return el estado de la operación
     */
    @Transactional
    public State<UUID, String> cancel(UUID bookingPublicId, UUID listingPublicId, boolean byLandlord) {
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        int deleteSuccess = 0;

        if (SecurityUtils.hasCurrentUserAnyOfAuthorities(SecurityUtils.ROLE_LANDLORD)
                && byLandlord) {
            deleteSuccess = handleDeletionForLandlord(bookingPublicId, listingPublicId, connectedUser, deleteSuccess);
        } else {
            deleteSuccess = bookingRepository.deleteBookingByFkTenantAndPublicId(connectedUser.publicId(), bookingPublicId);
        }

        if (deleteSuccess >= 1) {
            return State.<UUID, String>builder().forSuccess(bookingPublicId);
        } else {
            return State.<UUID, String>builder().forError("Booking not found");
        }
    }

    /**
     * Maneja la eliminación de una reserva por parte de un propietario.
     *
     * @param bookingPublicId el identificador público de la reserva
     * @param listingPublicId el identificador público del listado
     * @param connectedUser el usuario conectado
     * @param deleteSuccess el estado de eliminación
     * @return el estado de eliminación actualizado
     */
    private int handleDeletionForLandlord(UUID bookingPublicId, UUID listingPublicId, ReadUserDTO connectedUser, int deleteSuccess) {
        Optional<DisplayCardListingDTO> listingVerificationOpt = landlordService.getByPublicIdAndLandlordPublicId(listingPublicId, connectedUser.publicId());
        if (listingVerificationOpt.isPresent()) {
            deleteSuccess = bookingRepository.deleteBookingByPublicIdAndFkListing(bookingPublicId, listingVerificationOpt.get().publicId());
        }
        return deleteSuccess;
    }

    /**
     * Obtiene todas las reservas realizadas en las propiedades del propietario autenticado.
     *
     * @return una lista de BookedListingDTO que representa las reservas en las propiedades del propietario
     */
    @Transactional(readOnly = true)
    public List<BookedListingDTO> getBookedListingForLandlord() {
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        List<DisplayCardListingDTO> allProperties = landlordService.getAllProperties(connectedUser);
        List<UUID> allPropertyPublicIds = allProperties.stream().map(DisplayCardListingDTO::publicId).toList();
        List<Booking> allBookings = bookingRepository.findAllByFkListingIn(allPropertyPublicIds);
        return mapBookingToBookedListing(allBookings, allProperties);
    }

    /**
     * Obtiene los identificadores de los listados que coinciden con las fechas reservadas.
     *
     * @param listingsId una lista de identificadores de listados
     * @param bookedDateDTO las fechas reservadas
     * @return una lista de identificadores de los listados que coinciden
     */
    public List<UUID> getBookingMatchByListingIdsAndBookedDate(List<UUID> listingsId, BookedDateDTO bookedDateDTO) {
        return bookingRepository.findAllMatchWithDate(listingsId, bookedDateDTO.startDate(), bookedDateDTO.endDate())
                .stream().map(Booking::getFkListing).toList();
    }
}
