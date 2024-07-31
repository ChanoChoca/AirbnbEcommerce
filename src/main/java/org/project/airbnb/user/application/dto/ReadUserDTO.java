package org.project.airbnb.user.application.dto;

import java.util.Set;
import java.util.UUID;

/**
 * Data Transfer Object (DTO) que representa la información de un usuario que se lee desde la aplicación.
 *
 * @param publicId    Identificador único del usuario.
 * @param firstName   Nombre del usuario.
 * @param lastName    Apellido del usuario.
 * @param email       Correo electrónico del usuario.
 * @param imageUrl    URL de la imagen de perfil del usuario.
 * @param authorities Conjunto de roles o permisos asociados al usuario.
 */
public record ReadUserDTO(
        UUID publicId,         // Identificador único del usuario.
        String firstName,      // Nombre del usuario.
        String lastName,       // Apellido del usuario.
        String email,          // Correo electrónico del usuario.
        String imageUrl,       // URL de la imagen de perfil del usuario.
        Set<String> authorities // Conjunto de roles o permisos asociados al usuario.
) {
}
