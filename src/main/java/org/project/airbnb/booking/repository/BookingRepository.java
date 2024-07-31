package org.project.airbnb.booking.repository;

import org.project.airbnb.booking.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * BookingRepository es una interfaz que extiende JpaRepository para proporcionar
 * métodos de acceso a datos específicos para la entidad Booking.
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Verifica si ya existe una reserva en el intervalo de tiempo dado para una lista específica.
     *
     * @param startDate la fecha de inicio del intervalo.
     * @param endDate la fecha de fin del intervalo.
     * @param fkListing el ID público de la lista.
     * @return true si ya existe una reserva en el intervalo, false en caso contrario.
     */
    @Query("SELECT case when count(booking) > 0 then true else false end" +
            " from Booking booking WHERE NOT (booking.endDate <= :startDate or booking.startDate >= :endDate)" +
            " AND booking.fkListing = :fkListing")
    boolean bookingExistsAtInterval(OffsetDateTime startDate, OffsetDateTime endDate, UUID fkListing);

    /**
     * Encuentra todas las reservas para una lista específica.
     *
     * @param fkListing el ID público de la lista.
     * @return una lista de reservas.
     */
    List<Booking> findAllByFkListing(UUID fkListing);

    /**
     * Encuentra todas las reservas para un inquilino específico.
     *
     * @param fkTenant el ID público del inquilino.
     * @return una lista de reservas.
     */
    List<Booking> findAllByFkTenant(UUID fkTenant);

    /**
     * Elimina una reserva específica basada en el ID del inquilino y el ID público de la reserva.
     *
     * @param tenantPublicId el ID público del inquilino.
     * @param bookingPublicId el ID público de la reserva.
     * @return el número de reservas eliminadas.
     */
    int deleteBookingByFkTenantAndPublicId(UUID tenantPublicId, UUID bookingPublicId);

    /**
     * Elimina una reserva específica basada en el ID público de la reserva y el ID de la lista.
     *
     * @param bookingPublicId el ID público de la reserva.
     * @param listingPublicId el ID público de la lista.
     * @return el número de reservas eliminadas.
     */
    int deleteBookingByPublicIdAndFkListing(UUID bookingPublicId, UUID listingPublicId);

    /**
     * Encuentra todas las reservas para una lista de IDs de listas.
     *
     * @param allPropertyPublicIds una lista de IDs públicos de las listas.
     * @return una lista de reservas.
     */
    List<Booking> findAllByFkListingIn(List<UUID> allPropertyPublicIds);

    /**
     * Encuentra todas las reservas que coinciden con una lista de IDs de listas y un intervalo de fechas.
     *
     * @param fkListings una lista de IDs públicos de las listas.
     * @param startDate la fecha de inicio del intervalo.
     * @param endDate la fecha de fin del intervalo.
     * @return una lista de reservas que coinciden con los criterios.
     */
    @Query("SELECT booking FROM Booking booking WHERE " +
            "NOT (booking.endDate <= :startDate or booking.startDate >= :endDate) " +
            "AND booking.fkListing IN :fkListings")
    List<Booking> findAllMatchWithDate(List<UUID> fkListings, OffsetDateTime startDate, OffsetDateTime endDate);
}
