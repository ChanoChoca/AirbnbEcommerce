package org.project.airbnb.listing.application;

import org.project.airbnb.booking.application.BookingService;
import org.project.airbnb.listing.application.dto.DisplayCardListingDTO;
import org.project.airbnb.listing.application.dto.DisplayListingDTO;
import org.project.airbnb.listing.application.dto.SearchDTO;
import org.project.airbnb.listing.application.dto.sub.LandlordListingDTO;
import org.project.airbnb.listing.domain.BookingCategory;
import org.project.airbnb.listing.domain.Listing;
import org.project.airbnb.listing.mapper.ListingMapper;
import org.project.airbnb.listing.repository.ListingRepository;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.user.application.UserService;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TenantService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final UserService userService;
    private final BookingService bookingService;

    // Constructor para la inyección de dependencias
    public TenantService(ListingRepository listingRepository, ListingMapper listingMapper, UserService userService, BookingService bookingService) {
        this.listingRepository = listingRepository;
        this.listingMapper = listingMapper;
        this.userService = userService;
        this.bookingService = bookingService;
    }

    // Obtiene todas las propiedades por categoría de reserva con paginación
    public Page<DisplayCardListingDTO> getAllByCategory(Pageable pageable, BookingCategory category) {
        Page<Listing> allOrBookingCategory;
        if (category == BookingCategory.ALL) {
            // Obtiene todas las propiedades con solo la portada
            allOrBookingCategory = listingRepository.findAllWithCoverOnly(pageable);
        } else {
            // Obtiene las propiedades filtradas por categoría de reserva
            allOrBookingCategory = listingRepository.findAllByBookingCategoryWithCoverOnly(pageable, category);
        }

        // Mapea las propiedades a DTOs para la respuesta
        return allOrBookingCategory.map(listingMapper::listingToDisplayCardListingDTO);
    }

    // Obtiene un listado por ID público con información detallada
    @Transactional(readOnly = true)
    public State<DisplayListingDTO, String> getOne(UUID publicId) {
        Optional<Listing> listingByPublicIdOpt = listingRepository.findByPublicId(publicId);

        if (listingByPublicIdOpt.isEmpty()) {
            // Retorna un estado de error si el listado no existe
            return State.<DisplayListingDTO, String>builder()
                    .forError(String.format("Listing doesn't exist for publicId: %s", publicId));
        }

        // Convierte el listado a un DTO para la respuesta
        DisplayListingDTO displayListingDTO = listingMapper.listingToDisplayListingDTO(listingByPublicIdOpt.get());

        // Obtiene la información del usuario del arrendador asociado al listado
        ReadUserDTO readUserDTO = userService.getByPublicId(listingByPublicIdOpt.get().getLandlordPublicId()).orElseThrow();
        LandlordListingDTO landlordListingDTO = new LandlordListingDTO(readUserDTO.firstName(), readUserDTO.imageUrl());
        displayListingDTO.setLandlord(landlordListingDTO);

        // Retorna el estado exitoso con la información del listado
        return State.<DisplayListingDTO, String>builder().forSuccess(displayListingDTO);
    }

    // Realiza una búsqueda de listados según los parámetros proporcionados
    @Transactional(readOnly = true)
    public Page<DisplayCardListingDTO> search(Pageable pageable, SearchDTO newSearch) {

        // Obtiene las propiedades que coinciden con los parámetros de búsqueda
        Page<Listing> allMatchedListings = listingRepository.findAllByLocationAndBathroomsAndBedroomsAndGuestsAndBeds(
                pageable, newSearch.location(),
                newSearch.infos().baths().value(),
                newSearch.infos().bedrooms().value(),
                newSearch.infos().guests().value(),
                newSearch.infos().beds().value()
        );

        // Obtiene los IDs de los listados coincidentes
        List<UUID> listingUUIDs = allMatchedListings.stream().map(Listing::getPublicId).toList();

        // Obtiene los IDs de las reservas que coinciden con los listados y las fechas de reserva
        List<UUID> bookingUUIDs = bookingService.getBookingMatchByListingIdsAndBookedDate(listingUUIDs, newSearch.dates());

        // Filtra los listados que no están reservados
        List<DisplayCardListingDTO> listingsNotBooked = allMatchedListings.stream()
                .filter(listing -> !bookingUUIDs.contains(listing.getPublicId()))
                .map(listingMapper::listingToDisplayCardListingDTO)
                .toList();

        // Retorna los listados no reservados como una página
        return new PageImpl<>(listingsNotBooked, pageable, listingsNotBooked.size());
    }
}
