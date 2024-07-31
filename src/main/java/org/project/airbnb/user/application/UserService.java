package org.project.airbnb.user.application;

import org.project.airbnb.infrastructure.config.SecurityUtils;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.project.airbnb.user.domain.User;
import org.project.airbnb.user.mapper.UserMapper;
import org.project.airbnb.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final String UPDATED_AT_KEY = "updated_at";
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    /**
     * Constructor que inicializa el servicio de usuario con el repositorio y el mapper.
     *
     * @param userRepository Repositorio para operaciones con la entidad User.
     * @param userMapper Mapper para convertir entre entidades User y DTOs.
     */
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    /**
     * Obtiene el usuario autenticado desde el contexto de seguridad.
     *
     * @return DTO del usuario autenticado.
     */
    @Transactional(readOnly = true)
    public ReadUserDTO getAuthenticatedUserFromSecurityContext() {
        OAuth2User principal = (OAuth2User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = SecurityUtils.mapOauth2AttributesToUser(principal.getAttributes());
        return getByEmail(user.getEmail()).orElseThrow();
    }

    /**
     * Busca un usuario por su correo electrónico.
     *
     * @param email Correo electrónico del usuario.
     * @return DTO del usuario si se encuentra, o vacío si no se encuentra.
     */
    @Transactional(readOnly = true)
    public Optional<ReadUserDTO> getByEmail(String email) {
        Optional<User> oneByEmail = userRepository.findOneByEmail(email);
        return oneByEmail.map(userMapper::readUserDTOToUser);
    }

    /**
     * Sincroniza la información del usuario con el proveedor de identidad.
     *
     * @param oAuth2User Usuario de OAuth2 con atributos actualizados.
     * @param forceResync Indica si la sincronización debe realizarse incluso si no hay cambios.
     */
    public void syncWithIdp(OAuth2User oAuth2User, boolean forceResync) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        User user = SecurityUtils.mapOauth2AttributesToUser(attributes);
        Optional<User> existingUser = userRepository.findOneByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            if (attributes.get(UPDATED_AT_KEY) != null) {
                Instant lastModifiedDate = existingUser.orElseThrow().getLastModifiedDate();
                Instant idpModifiedDate;
                if (attributes.get(UPDATED_AT_KEY) instanceof Instant instant) {
                    idpModifiedDate = instant;
                } else {
                    idpModifiedDate = Instant.ofEpochSecond((Integer) attributes.get(UPDATED_AT_KEY));
                }
                if (idpModifiedDate.isAfter(lastModifiedDate) || forceResync) {
                    updateUser(user);
                }
            }
        } else {
            userRepository.saveAndFlush(user);
        }
    }

    /**
     * Actualiza un usuario en la base de datos.
     *
     * @param user Usuario con la información actualizada.
     */
    private void updateUser(User user) {
        Optional<User> userToUpdateOpt = userRepository.findOneByEmail(user.getEmail());
        if (userToUpdateOpt.isPresent()) {
            User userToUpdate = userToUpdateOpt.get();
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setFirstName(user.getFirstName());
            userToUpdate.setLastName(user.getLastName());
            userToUpdate.setAuthorities(user.getAuthorities());
            userToUpdate.setImageUrl(user.getImageUrl());
            userRepository.saveAndFlush(userToUpdate);
        }
    }

    /**
     * Busca un usuario por su ID público.
     *
     * @param publicId ID público del usuario.
     * @return DTO del usuario si se encuentra, o vacío si no se encuentra.
     */
    public Optional<ReadUserDTO> getByPublicId(UUID publicId) {
        Optional<User> oneByPublicId = userRepository.findOneByPublicId(publicId);
        return oneByPublicId.map(userMapper::readUserDTOToUser);
    }

}
