package br.com.phteam.consultoria.api.features.exercicio.dto.response;

public record ExercicioResponseDTO(
        Long id,
        String nome,
        String grupoMuscular,
        String equipamento,
        String urlVideo,
        String descricao
) {}
