package org.project.airbnb.listing.repository;

import org.project.airbnb.listing.domain.ListingPicture;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para gestionar las operaciones CRUD sobre entidades de tipo ListingPicture.
 * Extiende JpaRepository para proporcionar métodos de acceso a la base de datos.
 */
public interface ListingPictureRepository extends JpaRepository<ListingPicture, Long> {
    // JpaRepository ya proporciona los métodos básicos para operaciones CRUD y paginación.
    // No es necesario definir métodos adicionales a menos que se requiera funcionalidad específica.
}
