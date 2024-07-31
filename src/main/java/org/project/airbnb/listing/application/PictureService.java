package org.project.airbnb.listing.application;

import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.domain.ListingPicture;
import org.project.airbnb.listing.mapper.ListingPictureMapper;
import org.project.airbnb.listing.repository.ListingPictureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PictureService {

    private final ListingPictureRepository listingPictureRepository;
    private final ListingPictureMapper listingPictureMapper;

    // Constructor para la inyección de dependencias
    public PictureService(ListingPictureRepository listingPictureRepository, ListingPictureMapper listingPictureMapper) {
        this.listingPictureRepository = listingPictureRepository;
        this.listingPictureMapper = listingPictureMapper;
    }

    // Método para guardar todas las imágenes asociadas a un listado
    public List<PictureDTO> saveAll(List<PictureDTO> pictures, Listing listing) {
        // Mapea los DTOs de imágenes a entidades ListingPicture
        Set<ListingPicture> listingPictures = listingPictureMapper.pictureDTOsToListingPictures(pictures);

        boolean isFirst = true;

        // Itera sobre las imágenes y las configura
        for (ListingPicture listingPicture : listingPictures) {
            // Marca la primera imagen como portada
            listingPicture.setCover(isFirst);
            // Asocia la imagen con el listado
            listingPicture.setListing(listing);
            isFirst = false; // La primera imagen ya se ha marcado como portada
        }

        // Guarda todas las imágenes en la base de datos
        listingPictureRepository.saveAll(listingPictures);

        // Convierte las entidades ListingPicture de nuevo a DTOs y los retorna
        return listingPictureMapper.listingPictureToPictureDTO(listingPictures.stream().toList());
    }
}
