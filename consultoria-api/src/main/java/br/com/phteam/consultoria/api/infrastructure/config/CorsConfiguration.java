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
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "https://*.vercel.app",
                        "https://phteam-20kpzu3t5-joaogomes-projects-741c7808.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
