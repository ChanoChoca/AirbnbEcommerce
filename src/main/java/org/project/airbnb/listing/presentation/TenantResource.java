package org.project.airbnb.listing.presentation;

import jakarta.validation.Valid;
import org.project.airbnb.listing.application.TenantService;
import org.project.airbnb.listing.application.dto.DisplayCardListingDTO;
import org.project.airbnb.listing.application.dto.DisplayListingDTO;
import org.project.airbnb.listing.application.dto.SearchDTO;
import org.project.airbnb.listing.domain.BookingCategory;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.sharedkernel.service.StatusNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controlador REST para manejar las operaciones relacionadas con los anuncios para los inquilinos.
 */
@RestController
@RequestMapping("/api/tenant-listing")
public class TenantResource {

    private final TenantService tenantService;

    /**
     * Constructor para inicializar el recurso con el servicio necesario.
     *
     * @param tenantService Servicio para manejar la lógica de negocios de los anuncios.
     */
    public TenantResource(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    /**
     * Obtiene todos los anuncios filtrados por categoría de reserva.
     *
     * @param pageable Paginación y ordenación.
     * @param category Categoría de reserva para filtrar los anuncios.
     * @return Respuesta HTTP con una página de DTOs de anuncios.
     */
    @GetMapping("/get-all-by-category")
    public ResponseEntity<Page<DisplayCardListingDTO>> findAllByBookingCategory(Pageable pageable,
                                                                                @RequestParam BookingCategory category) {
        // Obtiene anuncios por categoría y retorna el resultado
        return ResponseEntity.ok(tenantService.getAllByCategory(pageable, category));
    }

    /**
     * Obtiene un anuncio específico por su ID público.
     *
     * @param publicId ID público del anuncio a obtener.
     * @return Respuesta HTTP con el DTO del anuncio o un detalle del problema si ocurre un error.
     */
    @GetMapping("/get-one")
    public ResponseEntity<DisplayListingDTO> getOne(@RequestParam UUID publicId) {
        // Obtiene el estado del anuncio y retorna el resultado
        State<DisplayListingDTO, String> displayListingState = tenantService.getOne(publicId);
        if (displayListingState.getStatus().equals(StatusNotification.OK)) {
            return ResponseEntity.ok(displayListingState.getValue());
        } else {
            // Construye un detalle del problema con el error del estado
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, displayListingState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
    }

    /**
     * Realiza una búsqueda de anuncios basada en los criterios proporcionados.
     *
     * @param pageable   Paginación y ordenación.
     * @param searchDTO  DTO que contiene los criterios de búsqueda.
     * @return Respuesta HTTP con una página de DTOs de anuncios que coinciden con los criterios de búsqueda.
     */
    @PostMapping("/search")
    public ResponseEntity<Page<DisplayCardListingDTO>> search(Pageable pageable,
                                                              @Valid @RequestBody SearchDTO searchDTO) {
        // Realiza la búsqueda y retorna el resultado
        return ResponseEntity.ok(tenantService.search(pageable, searchDTO));
    }
}
