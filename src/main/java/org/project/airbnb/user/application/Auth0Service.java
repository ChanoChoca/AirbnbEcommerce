package org.project.airbnb.user.application;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.FieldsFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.json.mgmt.users.User;
import com.auth0.net.Response;
import com.auth0.net.TokenRequest;
import org.project.airbnb.infrastructure.config.SecurityUtils;
import org.project.airbnb.user.application.dto.ReadUserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class Auth0Service {

    @Value("${okta.oauth2.client-id}")
    private String clientId; // ID del cliente para autenticación en Auth0

    @Value("${okta.oauth2.client-secret}")
    private String clientSecret; // Secreto del cliente para autenticación en Auth0

    @Value("${okta.oauth2.issuer}")
    private String domain; // Dominio de Auth0

    @Value("${application.auth0.role-landlord-id}")
    private String roleLandlordId; // ID del rol de "landlord" en Auth0

    /**
     * Asigna el rol de "landlord" al usuario si aún no lo tiene.
     *
     * @param readUserDTO DTO que representa al usuario.
     */
    public void addLandlordRoleToUser(ReadUserDTO readUserDTO) {
        // Verifica si el usuario ya tiene el rol de landlord
        if (readUserDTO.authorities().stream().noneMatch(role -> role.equals(SecurityUtils.ROLE_LANDLORD))) {
            try {
                // Obtiene el token de acceso para interactuar con la API de Auth0
                String accessToken = this.getAccessToken();
                // Asigna el rol de landlord al usuario
                assignRoleById(accessToken, readUserDTO.email(), readUserDTO.publicId(), roleLandlordId);
            } catch (Auth0Exception a) {
                // Lanza una excepción si no se puede asignar el rol
                throw new UserException(String.format("not possible to assign %s to %s", roleLandlordId, readUserDTO.publicId()));
            }
        }
    }

    /**
     * Asigna un rol a un usuario en Auth0 mediante su ID.
     *
     * @param accessToken   Token de acceso para autenticar la solicitud.
     * @param email         Correo electrónico del usuario.
     * @param publicId      ID público del usuario.
     * @param roleIdToAdd   ID del rol a asignar.
     * @throws Auth0Exception Si ocurre un error al interactuar con Auth0.
     */
    private void assignRoleById(String accessToken, String email, UUID publicId, String roleIdToAdd) throws Auth0Exception {
        // Crea una instancia de ManagementAPI con el token de acceso
        ManagementAPI mgmt = ManagementAPI.newBuilder(domain, accessToken).build();
        // Obtiene el usuario por su correo electrónico
        Response<List<User>> auth0userByEmail = mgmt.users().listByEmail(email, new FieldsFilter()).execute();
        // Encuentra el usuario correspondiente al ID público
        User user = auth0userByEmail.getBody()
                .stream().findFirst()
                .orElseThrow(() -> new UserException(String.format("Cannot find user with public id %s", publicId)));
        // Asigna el rol al usuario
        mgmt.roles().assignUsers(roleIdToAdd, List.of(user.getId())).execute();
    }

    /**
     * Obtiene un token de acceso para interactuar con la API de Auth0.
     *
     * @return Token de acceso.
     * @throws Auth0Exception Si ocurre un error al obtener el token.
     */
    private String getAccessToken() throws Auth0Exception {
        // Crea una instancia de AuthAPI con las credenciales del cliente
        AuthAPI authAPI = AuthAPI.newBuilder(domain, clientId, clientSecret).build();
        // Solicita un token de acceso
        TokenRequest tokenRequest = authAPI.requestToken(domain + "api/v2/");
        TokenHolder holder = tokenRequest.execute().getBody();
        return holder.getAccessToken();
    }
}
