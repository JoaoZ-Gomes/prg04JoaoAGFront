package br.com.phteam.consultoria.api.features.objetivo.dto;

import br.com.phteam.consultoria.api.features.objetivo.model.TipoObjetivo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ObjetivoRequestDTO(
        @NotNull(message = "O tipo de objetivo é obrigatório.")
        TipoObjetivo tipo,

        @NotBlank(message = "A descrição é obrigatória.")
        String descricao,

        String detalhes
) { }
