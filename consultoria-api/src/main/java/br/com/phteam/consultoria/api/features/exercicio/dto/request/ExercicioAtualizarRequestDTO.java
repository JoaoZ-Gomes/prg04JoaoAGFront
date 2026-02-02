package br.com.phteam.consultoria.api.features.exercicio.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExercicioAtualizarRequestDTO(

        @NotNull(message = "O ID é obrigatório")
        Long id,

        @Size(max = 100)
        String nome,

        @Size(max = 50)
        String grupoMuscular,

        @Size(max = 50)
        String equipamento,

        @Size(max = 255)
        String urlVideo,

        @Size(max = 500)
        String descricao
) {}
