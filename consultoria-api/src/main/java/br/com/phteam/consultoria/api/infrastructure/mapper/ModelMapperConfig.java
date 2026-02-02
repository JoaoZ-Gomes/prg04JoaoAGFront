package br.com.phteam.consultoria.api.infrastructure.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do ModelMapper para mapeamento de objetos.
 * Fornece um bean singleton do ModelMapper para a aplicação.
 */
@Configuration
public class ModelMapperConfig {

    /**
     * Cria e configura uma instância do ModelMapper.
     *
     * @return ModelMapper configurado
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}