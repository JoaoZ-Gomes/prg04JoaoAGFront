package br.com.phteam.consultoria.api.features.consultor.dto;

public record ConsultorResponseDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        String numeroCref,
        String especializacao
){ }