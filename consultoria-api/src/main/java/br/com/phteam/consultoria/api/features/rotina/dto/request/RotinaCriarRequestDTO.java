package br.com.phteam.consultoria.api.features.rotina.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RotinaCriarRequestDTO(

        @NotNull(message = "O ID da ficha é obrigatório")
        Long fichaId,

        @NotNull(message = "O ID do exercício é obrigatório")
        Long exercicioId,

        @NotNull(message = "O número de séries é obrigatório")
        Integer series,

        @NotNull(message = "O número de repetições é obrigatório")
        Integer repeticoes,

        @Size(max = 100)
        String nome
){ }
