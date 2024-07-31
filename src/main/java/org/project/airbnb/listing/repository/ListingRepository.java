package org.project.airbnb.listing.repository;

import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.domain.BookingCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio para gestionar las operaciones CRUD sobre entidades de tipo Listing.
 * Extiende JpaRepository para proporcionar métodos de acceso a la base de datos.
 */
public interface ListingRepository extends JpaRepository<Listing, Long> {

    /**
     * Encuentra todas las propiedades de un arrendador específico y recupera solo las imágenes de portada.
     *
     * @param landlordPublicId Identificador público del arrendador.
     * @return Lista de propiedades con la imagen de portada cargada.
     */
    @Query("SELECT listing FROM Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE listing.landlordPublicId = :landlordPublicId AND picture.isCover = true")
    List<Listing> findAllByLandlordPublicIdFetchCoverPicture(UUID landlordPublicId);

    /**
     * Elimina una propiedad basada en su identificador público y el identificador del arrendador.
     *
     * @param publicId Identificador público de la propiedad.
     * @param landlordPublicId Identificador público del arrendador.
     * @return Número de entidades eliminadas.
     */
    long deleteByPublicIdAndLandlordPublicId(UUID publicId, UUID landlordPublicId);

    /**
     * Encuentra todas las propiedades por categoría de reserva y recupera solo las imágenes de portada.
     *
     * @param pageable Información de paginación.
     * @param bookingCategory Categoría de reserva.
     * @return Página de propiedades con imagen de portada.
     */
    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true AND listing.bookingCategory = :bookingCategory")
    Page<Listing> findAllByBookingCategoryWithCoverOnly(Pageable pageable, BookingCategory bookingCategory);

    /**
     * Encuentra todas las propiedades y recupera solo las imágenes de portada.
     *
     * @param pageable Información de paginación.
     * @return Página de propiedades con imagen de portada.
     */
    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true")
    Page<Listing> findAllWithCoverOnly(Pageable pageable);

    /**
     * Encuentra una propiedad por su identificador público.
     *
     * @param publicId Identificador público de la propiedad.
     * @return Propiedad si se encuentra, vacío si no.
     */
    Optional<Listing> findByPublicId(UUID publicId);

    /**
     * Encuentra todas las propiedades cuyos identificadores públicos están en la lista proporcionada.
     *
     * @param allListingPublicIDs Lista de identificadores públicos de las propiedades.
     * @return Lista de propiedades.
     */
    List<Listing> findAllByPublicIdIn(List<UUID> allListingPublicIDs);

    /**
     * Encuentra una propiedad por su identificador público y el identificador del arrendador.
     *
     * @param listingPublicId Identificador público de la propiedad.
     * @param landlordPublicId Identificador público del arrendador.
     * @return Propiedad si se encuentra, vacío si no.
     */
    Optional<Listing> findOneByPublicIdAndLandlordPublicId(UUID listingPublicId, UUID landlordPublicId);

    /**
     * Encuentra todas las propiedades que coinciden con los criterios de búsqueda especificados.
     *
     * @param pageable Información de paginación.
     * @param location Ubicación de la propiedad.
     * @param bathrooms Número de baños.
     * @param bedrooms Número de dormitorios.
     * @param guests Número de huéspedes.
     * @param beds Número de camas.
     * @return Página de propiedades que coinciden con los criterios.
     */
    Page<Listing> findAllByLocationAndBathroomsAndBedroomsAndGuestsAndBeds(
            Pageable pageable, String location, int bathrooms, int bedrooms, int guests, int beds
    );
}
