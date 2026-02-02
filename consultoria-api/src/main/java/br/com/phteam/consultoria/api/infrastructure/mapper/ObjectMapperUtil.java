package br.com.phteam.consultoria.api.infrastructure.mapper;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utilitário para mapeamento de objetos usando ModelMapper.
 * Encapsula operações comuns de conversão entre entidades e DTOs.
 */
@Component
@RequiredArgsConstructor
public class ObjectMapperUtil {

    private final ModelMapper modelMapper;

    // =====================================================
    // SINGLE OBJECT MAPPING
    // =====================================================

    /**
     * Mapeia um objeto para outro tipo.
     *
     * @param source a fonte do mapeamento
     * @param targetClass a classe alvo do mapeamento
     * @param <S> tipo genérico da fonte
     * @param <T> tipo genérico do alvo
     * @return objeto mapeado do tipo T
     */
    public <S, T> T map(S source, Class<T> targetClass) {
        return modelMapper.map(source, targetClass);
    }

    // =====================================================
    // LIST MAPPING
    // =====================================================

    /**
     * Mapeia uma lista de objetos para outro tipo.
     *
     * @param sourceList lista de origem
     * @param targetClass classe alvo do mapeamento
     * @param <S> tipo genérico dos elementos da lista de origem
     * @param <T> tipo genérico dos elementos da lista alvo
     * @return lista de objetos mapeados do tipo T
     */
    public <S, T> List<T> mapAll(List<S> sourceList, Class<T> targetClass) {
        return sourceList.stream()
                .map(element -> modelMapper.map(element, targetClass))
                .collect(Collectors.toList());
    }
}