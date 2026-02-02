package br.com.phteam.consultoria.api.features.objetivo.dto;

import br.com.phteam.consultoria.api.features.objetivo.model.TipoObjetivo;

public record ObjetivoResponseDTO(
        Long id,
        TipoObjetivo tipo,
        String descricao,
        String detalhes,
        Boolean ativo
) { }
