package org.project.airbnb.listing.mapper;

import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.domain.ListingPicture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

/**
 * Mapper para convertir entre `ListingPicture` y `PictureDTO`.
 */
@Mapper(componentModel = "spring")
public interface ListingPictureMapper {

    /**
     * Convierte una lista de `PictureDTO` a un conjunto de `ListingPicture`.
     *
     * @param pictureDTOs Lista de DTOs de imagen para convertir.
     * @return Conjunto de entidades `ListingPicture`.
     */
    Set<ListingPicture> pictureDTOsToListingPictures(List<PictureDTO> pictureDTOs);

    /**
     * Convierte un `PictureDTO` a una entidad `ListingPicture`.
     * Ignora los campos `id`, `listing`, `createdDate`, y `lastModifiedDate`.
     * Mapea el campo `isCover` a `cover`.
     *
     * @param pictureDTO DTO de imagen para convertir.
     * @return Entidad `ListingPicture`.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "listing", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "cover", source = "isCover")
    ListingPicture pictureDTOToListingPicture(PictureDTO pictureDTO);

    /**
     * Convierte una lista de entidades `ListingPicture` a una lista de `PictureDTO`.
     *
     * @param listingPictures Lista de entidades `ListingPicture` para convertir.
     * @return Lista de DTOs de imagen.
     */
    List<PictureDTO> listingPictureToPictureDTO(List<ListingPicture> listingPictures);

    /**
     * Convierte una entidad `ListingPicture` a un `PictureDTO`.
     * Mapea el campo `cover` a `isCover`.
     *
     * @param listingPicture Entidad `ListingPicture` para convertir.
     * @return DTO de imagen.
     */
    @Mapping(target = "isCover", source = "cover")
    PictureDTO convertToPictureDTO(ListingPicture listingPicture);

    /**
     * Extrae la imagen de portada del conjunto de `ListingPicture`.
     * Utiliza el método `convertToPictureDTO` para la conversión.
     *
     * @param pictures Conjunto de entidades `ListingPicture`.
     * @return DTO de la imagen de portada.
     */
    @Named("extract-cover")
    default PictureDTO extractCover(Set<ListingPicture> pictures) {
        return pictures.stream().findFirst().map(this::convertToPictureDTO).orElseThrow();
    }
}
