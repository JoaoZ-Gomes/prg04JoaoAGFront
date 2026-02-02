package br.com.phteam.consultoria.api.features.objetivo.dto;

import br.com.phteam.consultoria.api.features.objetivo.model.TipoObjetivo;

public record ObjetivoUpdateDTO(
        TipoObjetivo tipo,
        String descricao,
        String detalhes,
        Boolean ativo
) { }
