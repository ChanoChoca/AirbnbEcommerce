package org.project.airbnb.user.presentation;

import jakarta.servlet.http.HttpServletRequest;
import org.project.airbnb.user.application.UserService;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.text.MessageFormat;
import java.util.Map;

/**
 * Controlador para manejar las peticiones relacionadas con la autenticación de usuarios.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthResource {

    private final UserService userService;
    private final ClientRegistration registration;

    /**
     * Constructor para inicializar `UserService` y `ClientRegistration` a partir del repositorio de registros de cliente.
     *
     * @param userService Servicio para la gestión de usuarios.
     * @param registrationRepository Repositorio para la gestión de registros de cliente.
     */
    public AuthResource(UserService userService, ClientRegistrationRepository registrationRepository) {
        this.userService = userService;
        this.registration = registrationRepository.findByRegistrationId("okta");
    }

    /**
     * Obtiene el usuario autenticado desde el contexto de seguridad y sincroniza los datos con el proveedor de identidad.
     *
     * @param user Usuario autenticado en el contexto de seguridad.
     * @param forceResync Bandera que indica si se debe forzar la sincronización con el proveedor de identidad.
     * @return Una respuesta con el DTO del usuario autenticado.
     */
    @GetMapping("/get-authenticated-user")
    public ResponseEntity<ReadUserDTO> getAuthenticatedUser(
            @AuthenticationPrincipal OAuth2User user, @RequestParam boolean forceResync) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            userService.syncWithIdp(user, forceResync);
            ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();
            return new ResponseEntity<>(connectedUser, HttpStatus.OK);
        }
    }

    /**
     * Maneja el cierre de sesión del usuario.
     *
     * @param request Solicitud HTTP que contiene información sobre la solicitud de cierre de sesión.
     * @return Una respuesta con la URL de cierre de sesión.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String issuerUri = registration.getProviderDetails().getIssuerUri();
        String originUrl = request.getHeader(HttpHeaders.ORIGIN);
        Object[] params = {issuerUri, registration.getClientId(), originUrl};
        String logoutUrl = MessageFormat.format("{0}v2/logout?client_id={1}&returnTo={2}", params);
        request.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logoutUrl", logoutUrl));
    }
}
