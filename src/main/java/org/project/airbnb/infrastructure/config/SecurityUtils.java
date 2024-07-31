package org.project.airbnb.infrastructure.config;

import org.project.airbnb.user.domain.Authority;
import org.project.airbnb.user.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Utilidades de seguridad para la aplicación, que incluyen métodos para mapear atributos OAuth2 a usuarios,
 * extraer autoridades de las reclamaciones JWT y verificar las autoridades actuales del usuario.
 */
public class SecurityUtils {

    public static final String ROLE_TENANT = "ROLE_TENANT";
    public static final String ROLE_LANDLORD = "ROLE_LANDLORD";

    public static final String CLAIMS_NAMESPACE = "https://www.codecake.fr/roles";

    /**
     * Mapea los atributos de un token OAuth2 a un objeto User.
     *
     * @param attributes un mapa de atributos del token OAuth2.
     * @return un objeto User con los atributos mapeados.
     */
    public static User mapOauth2AttributesToUser(Map<String, Object> attributes) {
        User user = new User();
        String sub = String.valueOf(attributes.get("sub"));

        String username = null;

        if (attributes.get("preferred_username") != null) {
            username = ((String) attributes.get("preferred_username")).toLowerCase();
        }

        // Asigna el primer nombre del usuario.
        if (attributes.get("given_name") != null) {
            user.setFirstName(((String) attributes.get("given_name")));
        } else if (attributes.get("nickname") != null) {
            user.setFirstName(((String) attributes.get("nickname")));
        }

        // Asigna el apellido del usuario.
        if (attributes.get("family_name") != null) {
            user.setLastName(((String) attributes.get("family_name")));
        }

        // Asigna el email del usuario.
        if (attributes.get("email") != null) {
            user.setEmail(((String) attributes.get("email")));
        } else if (sub.contains("|") && (username != null && username.contains("@"))) {
            user.setEmail(username);
        } else {
            user.setEmail(sub);
        }

        // Asigna la URL de la imagen del usuario.
        if (attributes.get("picture") != null) {
            user.setImageUrl(((String) attributes.get("picture")));
        }

        // Asigna las autoridades del usuario.
        if(attributes.get(CLAIMS_NAMESPACE) != null) {
            List<String> authoritiesRaw = (List<String>) attributes.get(CLAIMS_NAMESPACE);
            Set<Authority> authorities = authoritiesRaw.stream()
                    .map(authority -> {
                        Authority auth = new Authority();
                        auth.setName(authority);
                        return auth;
                    }).collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        return user;
    }

    /**
     * Extrae una lista de SimpleGrantedAuthority a partir de las reclamaciones del token.
     *
     * @param claims un mapa de reclamaciones del token.
     * @return una lista de SimpleGrantedAuthority.
     */
    public static List<SimpleGrantedAuthority> extractAuthorityFromClaims(Map<String, Object> claims) {
        return mapRolesToGrantedAuthorities(getRolesFromClaims(claims));
    }

    private static Collection<String> getRolesFromClaims(Map<String, Object> claims) {
        return (List<String>) claims.get(CLAIMS_NAMESPACE);
    }

    private static List<SimpleGrantedAuthority> mapRolesToGrantedAuthorities(Collection<String> roles) {
        return roles.stream().filter(role -> role.startsWith("ROLE_")).map(SimpleGrantedAuthority::new).toList();
    }

    /**
     * Verifica si el usuario actual tiene alguna de las autoridades especificadas.
     *
     * @param authorities los nombres de las autoridades a verificar.
     * @return true si el usuario tiene al menos una de las autoridades especificadas, false en caso contrario.
     */
    public static boolean hasCurrentUserAnyOfAuthorities(String ...authorities) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null && getAuthorities(authentication)
                .anyMatch(authority -> Arrays.asList(authorities).contains(authority)));
    }

    private static Stream<String> getAuthorities(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication
                instanceof JwtAuthenticationToken jwtAuthenticationToken ?
                extractAuthorityFromClaims(jwtAuthenticationToken.getToken().getClaims()) : authentication.getAuthorities();
        return authorities.stream().map(GrantedAuthority::getAuthority);
    }
}
