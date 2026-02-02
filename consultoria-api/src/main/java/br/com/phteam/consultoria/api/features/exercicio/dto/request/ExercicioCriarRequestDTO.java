package br.com.phteam.consultoria.api.features.exercicio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExercicioCriarRequestDTO(

        @NotBlank(message = "O nome do exercício é obrigatório")
        @Size(max = 100)
        String nome,

        @NotBlank(message = "O grupo muscular é obrigatório")
        @Size(max = 50)
        String grupoMuscular,

        @Size(max = 50)
        String equipamento,

        @Size(max = 255)
        String urlVideo,

        @Size(max = 500)
        String descricao
) {}
