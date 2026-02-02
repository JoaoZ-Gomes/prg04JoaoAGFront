package br.com.phteam.consultoria.api.infrastructure.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import br.com.phteam.consultoria.api.features.usuario.CustomUserDetailsService;
import br.com.phteam.consultoria.api.infrastructure.auth.jwt.JwtAuthorizationFilter;

import java.util.List;

/**
 * Configuração de segurança da aplicação.
 * Define autenticação, autorização, CORS e filtros JWT.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    /**
     * Configura a cadeia de filtros de segurança.
     *
     * @param http HttpSecurity para configuração
     * @return SecurityFilterChain configurado
     * @throws Exception se houver erro na configuração
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Configuração de CORS
                .cors(cors -> {})
                // CSRF desabilitado (API stateless)
                .csrf(AbstractHttpConfigurer::disable)
                // API sem sessão (stateless)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Regras de acesso
                .authorizeHttpRequests(authorize -> authorize
                        // Endpoints públicos
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Criar cliente
                        .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()
                        // Acesso do cliente
                        .requestMatchers(HttpMethod.GET, "/api/clientes/meu-perfil")
                        .hasRole("CLIENTE")
                        // Acesso do consultor
                        .requestMatchers(HttpMethod.GET, "/api/clientes/**")
                        .hasRole("CONSULTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/clientes/**")
                        .hasRole("CONSULTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/clientes/**")
                        .hasRole("CONSULTOR")
                        .requestMatchers("/api/consultores/**")
                        .hasRole("CONSULTOR")
                        // Qualquer outra requisição requer autenticação
                        .anyRequest().authenticated()
                )
                // Filtro JWT
                .addFilterBefore(
                        jwtAuthorizationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    /**
     * Configura o gerenciador de autenticação.
     *
     * @param http HttpSecurity para obter o builder
     * @return AuthenticationManager configurado
     * @throws Exception se houver erro na configuração
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http)
            throws Exception {

        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());

        return authBuilder.build();
    }

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    /**
     * Configura o codificador de senha BCrypt.
     *
     * @return PasswordEncoder BCrypt configurado
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =====================================================
    // CORS CONFIGURATION SOURCE
    // =====================================================

    /**
     * Configura a origem CORS da aplicação.
     *
     * @return CorsConfigurationSource configurado
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        org.springframework.web.cors.CorsConfiguration config =
                new org.springframework.web.cors.CorsConfiguration();

        config.setAllowedOriginPatterns(
                List.of("http://localhost:*")
        );

        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
