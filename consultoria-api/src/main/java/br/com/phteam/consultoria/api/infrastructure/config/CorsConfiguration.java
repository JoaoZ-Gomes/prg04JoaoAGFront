package br.com.phteam.consultoria.api.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração de CORS para a aplicação.
 * Define as políticas de cross-origin para aceitar requisições do frontend.
 */
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    // =====================================================
    // CORS MAPPING
    // =====================================================

    /**
     * Configura as regras de CORS para todos os endpoints.
     *
     * @param registry o registro de CORS
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Permite qualquer porta do localhost
                .allowedOriginPatterns("http://localhost:*")
                // Permite todos os métodos HTTP comuns
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Permite envio de cookies/token se necessário
                .allowCredentials(true)
                // Permite qualquer header
                .allowedHeaders("*");
    }
}
