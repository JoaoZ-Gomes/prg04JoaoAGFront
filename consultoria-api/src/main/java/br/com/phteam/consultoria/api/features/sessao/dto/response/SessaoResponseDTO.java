package br.com.phteam.consultoria.api.features.sessao.dto.response;

import java.time.LocalDate;

public record SessaoResponseDTO(
        Long id,
        Long rotinaId,
        LocalDate dataSessao,
        String observacoes,
        String status
){ }
