package br.com.phteam.consultoria.api.features.ficha.dto.response;

public record FichaResponseDTO(
        Long id,
        String nome,
        String objetivo,
        Long clienteId
) {}
