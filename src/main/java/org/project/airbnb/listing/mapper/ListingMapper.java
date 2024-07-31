package org.project.airbnb.listing.mapper;

import org.project.airbnb.listing.application.dto.*;
import org.project.airbnb.listing.application.dto.vo.PriceVO;
import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.mapper.ListingPictureMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper para convertir entre `Listing` y varios DTOs relacionados.
 */
@Mapper(componentModel = "spring", uses = {ListingPictureMapper.class})
public interface ListingMapper {

    /**
     * Convierte un `SaveListingDTO` a una entidad `Listing`.
     * Ignora los campos `landlordPublicId`, `publicId`, `lastModifiedDate`, `id`, `createdDate`, y `pictures`.
     * Mapea los valores anidados de `description` y `infos` a los campos correspondientes de `Listing`.
     *
     * @param saveListingDTO DTO para convertir.
     * @return Entidad `Listing`.
     */
    @Mapping(target = "landlordPublicId", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "pictures", ignore = true)
    @Mapping(target = "title", source = "description.title.value")
    @Mapping(target = "description", source = "description.description.value")
    @Mapping(target = "bedrooms", source = "infos.bedrooms.value")
    @Mapping(target = "guests", source = "infos.guests.value")
    @Mapping(target = "bookingCategory", source = "category")
    @Mapping(target = "beds", source = "infos.beds.value")
    @Mapping(target = "bathrooms", source = "infos.baths.value")
    @Mapping(target = "price", source = "price.value")
    Listing saveListingDTOToListing(SaveListingDTO saveListingDTO);

    /**
     * Convierte una entidad `Listing` a un `CreatedListingDTO`.
     *
     * @param listing Entidad `Listing` para convertir.
     * @return DTO de listado creado.
     */
    CreatedListingDTO listingToCreatedListingDTO(Listing listing);

    /**
     * Convierte una lista de entidades `Listing` a una lista de `DisplayCardListingDTO`.
     * Mapea la propiedad `cover` de cada DTO usando el conjunto de imágenes.
     *
     * @param listings Lista de entidades `Listing` para convertir.
     * @return Lista de DTOs de tarjetas de visualización.
     */
    @Mapping(target = "cover", source = "pictures")
    List<DisplayCardListingDTO> listingToDisplayCardListingDTOs(List<Listing> listings);

    /**
     * Convierte una entidad `Listing` a un `DisplayCardListingDTO`.
     * Mapea la propiedad `cover` usando el nombre calificado `extract-cover`.
     *
     * @param listing Entidad `Listing` para convertir.
     * @return DTO de tarjeta de visualización.
     */
    @Mapping(target = "cover", source = "pictures", qualifiedByName = "extract-cover")
    DisplayCardListingDTO listingToDisplayCardListingDTO(Listing listing);

    /**
     * Convierte un valor de precio entero a un `PriceVO`.
     *
     * @param price Valor del precio para convertir.
     * @return Objeto `PriceVO`.
     */
    default PriceVO mapPriceToPriceVO(int price) {
        return new PriceVO(price);
    }

    /**
     * Convierte una entidad `Listing` a un `DisplayListingDTO`.
     * Ignora el campo `landlord` y mapea los valores anidados de `description` y `infos`.
     *
     * @param listing Entidad `Listing` para convertir.
     * @return DTO de listado para mostrar.
     */
    @Mapping(target = "landlord", ignore = true)
    @Mapping(target = "description.title.value", source = "title")
    @Mapping(target = "description.description.value", source = "description")
    @Mapping(target = "infos.bedrooms.value", source = "bedrooms")
    @Mapping(target = "infos.guests.value", source = "guests")
    @Mapping(target = "infos.beds.value", source = "beds")
    @Mapping(target = "infos.baths.value", source = "bathrooms")
    @Mapping(target = "category", source = "bookingCategory")
    @Mapping(target = "price.value", source = "price")
    DisplayListingDTO listingToDisplayListingDTO(Listing listing);

    /**
     * Convierte una entidad `Listing` a un `ListingCreateBookingDTO`.
     * Mapea el `publicId` a `listingPublicId`.
     *
     * @param listing Entidad `Listing` para convertir.
     * @return DTO para crear una reserva.
     */
    @Mapping(target = "listingPublicId", source = "publicId")
    ListingCreateBookingDTO mapListingToListingCreateBookingDTO(Listing listing);
}
