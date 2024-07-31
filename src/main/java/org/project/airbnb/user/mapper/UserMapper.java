package org.project.airbnb.user.mapper;

import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.project.airbnb.user.domain.Authority;
import org.project.airbnb.user.domain.User;
import org.mapstruct.Mapper;

/**
 * Mapper para convertir entre entidades `User` y objetos de transferencia de datos `ReadUserDTO`.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Convierte una entidad `User` a un objeto de transferencia de datos `ReadUserDTO`.
     *
     * @param user Entidad `User` que se va a convertir.
     * @return Un objeto `ReadUserDTO` que representa al usuario.
     */
    ReadUserDTO readUserDTOToUser(User user);

    /**
     * Convierte una entidad `Authority` a su representación en cadena.
     *
     * Este método es un ejemplo de un método de mapeo personalizado para MapStruct.
     *
     * @param authority Entidad `Authority` que se va a convertir.
     * @return El nombre de la autoridad como una cadena.
     */
    default String mapAuthoritiesToString(Authority authority) {
        return authority.getName();
    }
}
