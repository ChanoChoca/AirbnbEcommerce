package org.project.airbnb.user.repository;

import org.project.airbnb.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio para manejar operaciones CRUD con la entidad `User`.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por su correo electrónico.
     *
     * @param email El correo electrónico del usuario.
     * @return Un `Optional` que contiene el usuario si se encuentra, o vacío si no existe.
     */
    Optional<User> findOneByEmail(String email);

    /**
     * Busca un usuario por su identificador público.
     *
     * @param publicId El identificador público del usuario.
     * @return Un `Optional` que contiene el usuario si se encuentra, o vacío si no existe.
     */
    Optional<User> findOneByPublicId(UUID publicId);
}
