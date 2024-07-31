package org.project.airbnb.listing.application;

import org.project.airbnb.listing.application.PictureService;
import org.project.airbnb.listing.application.dto.CreatedListingDTO;
import org.project.airbnb.listing.application.dto.DisplayCardListingDTO;
import org.project.airbnb.listing.application.dto.ListingCreateBookingDTO;
import org.project.airbnb.listing.application.dto.SaveListingDTO;
import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.mapper.ListingMapper;
import org.project.airbnb.listing.repository.ListingRepository;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.user.application.Auth0Service;
import org.project.airbnb.user.application.UserService;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LandlordService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final UserService userService;
    private final Auth0Service auth0Service;
    private final PictureService pictureService;

    // Constructor para la inyección de dependencias
    public LandlordService(ListingRepository listingRepository, ListingMapper listingMapper, UserService userService, Auth0Service auth0Service, PictureService pictureService) {
        this.listingRepository = listingRepository;
        this.listingMapper = listingMapper;
        this.userService = userService;
        this.auth0Service = auth0Service;
        this.pictureService = pictureService;
    }

    // Método para crear un nuevo listado
    public CreatedListingDTO create(SaveListingDTO saveListingDTO) {
        // Mapea el DTO a la entidad Listing
        Listing newListing = listingMapper.saveListingDTOToListing(saveListingDTO);

        // Obtiene el usuario autenticado desde el contexto de seguridad
        ReadUserDTO userConnected = userService.getAuthenticatedUserFromSecurityContext();
        // Asocia el listado con el ID del arrendador
        newListing.setLandlordPublicId(userConnected.publicId());

        // Guarda el nuevo listado en la base de datos
        Listing savedListing = listingRepository.saveAndFlush(newListing);

        // Guarda todas las imágenes asociadas al listado
        pictureService.saveAll(saveListingDTO.getPictures(), savedListing);

        // Asigna el rol de arrendador al usuario autenticado
        auth0Service.addLandlordRoleToUser(userConnected);

        // Retorna el DTO del listado creado
        return listingMapper.listingToCreatedListingDTO(savedListing);
    }

    // Método para obtener todos los listados de un arrendador específico
    @Transactional(readOnly = true)
    public List<DisplayCardListingDTO> getAllProperties(ReadUserDTO landlord) {
        // Busca todos los listados asociados al ID del arrendador y obtiene la imagen de portada
        List<Listing> properties = listingRepository.findAllByLandlordPublicIdFetchCoverPicture(landlord.publicId());
        // Mapea las entidades Listing a DTOs para mostrar en la interfaz de usuario
        return listingMapper.listingToDisplayCardListingDTOs(properties);
    }

    // Método para eliminar un listado basado en su ID y el ID del arrendador
    @Transactional
    public State<UUID, String> delete(UUID publicId, ReadUserDTO landlord) {
        // Elimina el listado solo si coincide con el ID del arrendador
        long deletedSuccessfully = listingRepository.deleteByPublicIdAndLandlordPublicId(publicId, landlord.publicId());
        // Retorna el estado de la operación
        if (deletedSuccessfully > 0) {
            return State.<UUID, String>builder().forSuccess(publicId);
        } else {
            return State.<UUID, String>builder().forUnauthorized("User not authorized to delete this listing");
        }
    }

    // Método para obtener información de reserva de un listado específico
    public Optional<ListingCreateBookingDTO> getByListingPublicId(UUID publicId) {
        // Busca el listado por su ID y mapea a DTO de reserva
        return listingRepository.findByPublicId(publicId).map(listingMapper::mapListingToListingCreateBookingDTO);
    }

    // Método para obtener tarjetas de visualización para una lista de IDs de listados
    public List<DisplayCardListingDTO> getCardDisplayByListingPublicId(List<UUID> allListingPublicIDs) {
        // Busca todos los listados con los IDs proporcionados y mapea a DTOs de tarjetas
        return listingRepository.findAllByPublicIdIn(allListingPublicIDs)
                .stream()
                .map(listingMapper::listingToDisplayCardListingDTO)
                .toList();
    }

    // Método para obtener un listado basado en su ID y el ID del arrendador
    @Transactional(readOnly = true)
    public Optional<DisplayCardListingDTO> getByPublicIdAndLandlordPublicId(UUID listingPublicId, UUID landlordPublicId) {
        // Busca el listado y verifica que pertenece al arrendador
        return listingRepository.findOneByPublicIdAndLandlordPublicId(listingPublicId, landlordPublicId)
                .map(listingMapper::listingToDisplayCardListingDTO);
    }
}
