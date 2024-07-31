package org.project.airbnb.booking.presentation;

import org.project.airbnb.booking.application.BookingService;
import org.project.airbnb.booking.application.dto.BookedDateDTO;
import org.project.airbnb.booking.application.dto.BookedListingDTO;
import org.project.airbnb.booking.application.dto.NewBookingDTO;
import org.project.airbnb.infrastructure.config.SecurityUtils;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.sharedkernel.service.StatusNotification;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * BookingResource es un controlador REST para manejar las operaciones relacionadas
 * con las reservas en la aplicación Airbnb.
 */
@RestController
@RequestMapping("/api/booking")
public class BookingResource {

    private final BookingService bookingService;

    /**
     * Constructor para inyectar dependencias.
     *
     * @param bookingService el servicio de reservas.
     */
    public BookingResource(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Endpoint para crear una nueva reserva.
     *
     * @param newBookingDTO el DTO que contiene la información de la nueva reserva.
     * @return una respuesta HTTP indicando si la operación fue exitosa o no.
     */
    @PostMapping("create")
    public ResponseEntity<Boolean> create(@Valid @RequestBody NewBookingDTO newBookingDTO) {
        State<Void, String> createState = bookingService.create(newBookingDTO);
        if (createState.getStatus().equals(StatusNotification.ERROR)) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, createState.getError());
            return ResponseEntity.of(problemDetail).build();
        } else {
            return ResponseEntity.ok(true);
        }
    }

    /**
     * Endpoint para verificar la disponibilidad de fechas para una lista específica.
     *
     * @param listingPublicId el ID público de la lista.
     * @return una lista de DTOs con las fechas reservadas.
     */
    @GetMapping("check-availability")
    public ResponseEntity<List<BookedDateDTO>> checkAvailability(@RequestParam UUID listingPublicId) {
        return ResponseEntity.ok(bookingService.checkAvailability(listingPublicId));
    }

    /**
     * Endpoint para obtener las reservas del usuario autenticado.
     *
     * @return una lista de DTOs con las reservas del usuario.
     */
    @GetMapping("get-booked-listing")
    public ResponseEntity<List<BookedListingDTO>> getBookedListing() {
        return ResponseEntity.ok(bookingService.getBookedListing());
    }

    /**
     * Endpoint para cancelar una reserva.
     *
     * @param bookingPublicId el ID público de la reserva.
     * @param listingPublicId el ID público de la lista.
     * @param byLandlord indica si la cancelación es realizada por el propietario.
     * @return el ID de la reserva cancelada.
     */
    @DeleteMapping("cancel")
    public ResponseEntity<UUID> cancel(@RequestParam UUID bookingPublicId,
                                       @RequestParam UUID listingPublicId,
                                       @RequestParam boolean byLandlord) {
        State<UUID, String> cancelState = bookingService.cancel(bookingPublicId, listingPublicId, byLandlord);
        if (cancelState.getStatus().equals(StatusNotification.ERROR)) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, cancelState.getError());
            return ResponseEntity.of(problemDetail).build();
        } else {
            return ResponseEntity.ok(bookingPublicId);
        }
    }

    /**
     * Endpoint para que los propietarios obtengan sus reservas.
     * Requiere que el usuario tenga el rol de propietario.
     *
     * @return una lista de DTOs con las reservas de las propiedades del propietario.
     */
    @GetMapping("get-booked-listing-for-landlord")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<List<BookedListingDTO>> getBookedListingForLandlord() {
        return ResponseEntity.ok(bookingService.getBookedListingForLandlord());
    }
}
