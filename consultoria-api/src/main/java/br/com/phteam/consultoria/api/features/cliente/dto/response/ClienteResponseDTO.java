package br.com.phteam.consultoria.api.features.cliente.dto.response;

import java.time.LocalDate;

public record ClienteResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String rg,
        LocalDate dataNascimento,
        String telefone,
        Double pesoAtual,
        Double altura
){ }