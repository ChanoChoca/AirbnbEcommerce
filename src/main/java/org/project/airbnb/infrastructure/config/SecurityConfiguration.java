package org.project.airbnb.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import java.util.HashSet;
import java.util.Set;

/**
 * Configuración de seguridad para la aplicación.
 * Esta clase configura la seguridad web, el manejo de CSRF, y la autenticación basada en OAuth2 y JWT.
 */
@Configuration
@EnableMethodSecurity // Habilita la seguridad basada en métodos para controlar el acceso a nivel de métodos.
public class SecurityConfiguration {

    @Value("${okta.oauth2.issuer}")
    private String issuerUri; // URI del emisor para la validación de JWT.

    /**
     * Configura la seguridad de la aplicación, incluyendo autenticación y autorización.
     *
     * @param http el objeto HttpSecurity para configurar la seguridad.
     * @return el SecurityFilterChain configurado.
     * @throws Exception en caso de error en la configuración.
     */
    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null); // Desactiva el nombre del atributo CSRF en la solicitud.

        http.authorizeHttpRequests(authorize -> authorize
                        // Permite el acceso sin autenticación a estas rutas específicas.
                        .requestMatchers(HttpMethod.GET, "api/tenant-listing/get-all-by-category").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tenant-listing/get-one").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/tenant-listing/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/booking/check-availability").permitAll()
                        .requestMatchers(HttpMethod.GET, "assets/*").permitAll()
                        // Requiere autenticación para cualquier otra solicitud.
                        .anyRequest()
                        .authenticated())
                .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(requestHandler)) // Configura el manejo de tokens CSRF.
                .oauth2Login(Customizer.withDefaults()) // Configura el inicio de sesión con OAuth2.
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())) // Configura el servidor de recursos OAuth2 para usar JWT.
                .oauth2Client(Customizer.withDefaults()); // Configura el cliente OAuth2.

        return http.build(); // Construye y devuelve el filtro de seguridad configurado.
    }

    /**
     * Configura el decodificador JWT usando el URI del conjunto de claves JWK.
     *
     * @return el JwtDecoder configurado.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(issuerUri).build(); // Construye un decodificador JWT usando el URI del emisor.
    }

    /**
     * Configura un mapeador de autoridades para transformar las autoridades de OIDC en GrantedAuthority.
     *
     * @return el GrantedAuthoritiesMapper configurado.
     */
    @Bean
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return authorities -> {
            Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

            authorities.forEach(grantedAuthority -> {
                if (grantedAuthority instanceof OidcUserAuthority oidcUserAuthority) {
                    // Extrae las autoridades de las reclamaciones del usuario OIDC y las añade al conjunto de autoridades concedidas.
                    grantedAuthorities
                            .addAll(SecurityUtils.extractAuthorityFromClaims(oidcUserAuthority.getUserInfo().getClaims()));
                }
            });
            return grantedAuthorities;
        };
    }
}
