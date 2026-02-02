package br.com.phteam.consultoria.api.features.ficha.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FichaAtualizarRequestDTO(

        @NotNull(message = "O ID é obrigatório")
        Long id,

        @Size(max = 100)
        String nome,

        @Size(max = 500)
        String objetivo
)
{}
