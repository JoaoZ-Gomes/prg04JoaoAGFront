package br.com.phteam.consultoria.api.features.sessao.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SessaoAtualizarRequestDTO(
        @NotNull(message = "O ID é obrigatório")
        Long id,

        LocalDate dataSessao,

        @Size(max = 500)
        String observacoes,

        @Size(max = 50)
        String status
){ }
