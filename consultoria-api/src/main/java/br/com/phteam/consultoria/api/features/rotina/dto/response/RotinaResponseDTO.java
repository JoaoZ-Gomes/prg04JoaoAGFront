package br.com.phteam.consultoria.api.features.rotina.dto.response;

public record RotinaResponseDTO(
        Long id,
        String nome,
        Long fichaId,
        Long exercicioId,
        Integer series,
        Integer repeticoes
){ }
