package org.project.airbnb.listing.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.airbnb.infrastructure.config.SecurityUtils;
import org.project.airbnb.listing.application.LandlordService;
import org.project.airbnb.listing.application.dto.CreatedListingDTO;
import org.project.airbnb.listing.application.dto.DisplayCardListingDTO;
import org.project.airbnb.listing.application.dto.SaveListingDTO;
import org.project.airbnb.listing.application.dto.sub.PictureDTO;
import org.project.airbnb.sharedkernel.service.State;
import org.project.airbnb.sharedkernel.service.StatusNotification;
import org.project.airbnb.user.application.UserException;
import org.project.airbnb.user.application.UserService;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Controlador REST para manejar las operaciones relacionadas con los anuncios de los arrendadores.
 */
@RestController
@RequestMapping("/api/landlord-listing")
public class LandlordResource {

    private final LandlordService landlordService;
    private final Validator validator;
    private final UserService userService;
    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Constructor para inicializar el recurso con los servicios necesarios.
     *
     * @param landlordService Servicio para manejar la lógica de negocios de los anuncios.
     * @param validator       Validador para validar DTOs.
     * @param userService     Servicio para manejar la lógica relacionada con los usuarios.
     */
    public LandlordResource(LandlordService landlordService, Validator validator, UserService userService) {
        this.landlordService = landlordService;
        this.validator = validator;
        this.userService = userService;
    }

    /**
     * Crea un nuevo anuncio a partir de los datos proporcionados.
     * Se espera que la solicitud contenga un archivo y un JSON para el DTO del anuncio.
     *
     * @param request                Solicitud multipart que contiene archivos.
     * @param saveListingDTOString   JSON del DTO del anuncio.
     * @return Respuesta HTTP con el DTO del anuncio creado o errores de validación.
     * @throws IOException Si ocurre un error al leer el JSON.
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreatedListingDTO> create(
            MultipartHttpServletRequest request,
            @RequestPart(name = "dto") String saveListingDTOString
    ) throws IOException {
        // Convierte los archivos en PictureDTO
        List<PictureDTO> pictures = request.getFileMap()
                .values()
                .stream()
                .map(mapMultipartFileToPictureDTO())
                .toList();

        // Convierte el JSON del DTO a un objeto SaveListingDTO
        SaveListingDTO saveListingDTO = objectMapper.readValue(saveListingDTOString, SaveListingDTO.class);
        saveListingDTO.setPictures(pictures);

        // Valida el DTO
        Set<ConstraintViolation<SaveListingDTO>> violations = validator.validate(saveListingDTO);
        if (!violations.isEmpty()) {
            // Construye un detalle del problema con las violaciones de validación
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());

            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, violationsJoined);
            return ResponseEntity.of(problemDetail).build();
        } else {
            // Llama al servicio para crear el anuncio y retorna el resultado
            return ResponseEntity.ok(landlordService.create(saveListingDTO));
        }
    }

    /**
     * Función para convertir un archivo multipart en un DTO de imagen.
     *
     * @return Función que mapea MultipartFile a PictureDTO.
     */
    private static Function<MultipartFile, PictureDTO> mapMultipartFileToPictureDTO() {
        return multipartFile -> {
            try {
                return new PictureDTO(multipartFile.getBytes(), multipartFile.getContentType(), false);
            } catch (IOException ioe) {
                throw new UserException(String.format("Cannot parse multipart file: %s", multipartFile.getOriginalFilename()));
            }
        };
    }

    /**
     * Obtiene todos los anuncios del arrendador autenticado.
     *
     * @return Respuesta HTTP con la lista de DTOs de anuncios.
     */
    @GetMapping(value = "/get-all")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<List<DisplayCardListingDTO>> getAll() {
        // Obtiene el usuario autenticado
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        // Obtiene todas las propiedades del arrendador
        List<DisplayCardListingDTO> allProperties = landlordService.getAllProperties(connectedUser);
        return ResponseEntity.ok(allProperties);
    }

    /**
     * Elimina un anuncio por su ID público.
     *
     * @param publicId ID público del anuncio a eliminar.
     * @return Respuesta HTTP con el ID del anuncio eliminado o código de estado de error.
     */
    @DeleteMapping("/delete")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<UUID> delete(@RequestParam UUID publicId) {
        // Obtiene el usuario autenticado
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
        // Elimina el anuncio y obtiene el estado
        State<UUID, String> deleteState = landlordService.delete(publicId, connectedUser);
        if (deleteState.getStatus().equals(StatusNotification.OK)) {
            return ResponseEntity.ok(deleteState.getValue());
        } else if (deleteState.getStatus().equals(StatusNotification.UNAUTHORIZED)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
