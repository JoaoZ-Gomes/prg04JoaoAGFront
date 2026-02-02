package br.com.phteam.consultoria.api.features.sessao.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SessaoCriarRequestDTO(
        @NotNull(message = "O ID da rotina é obrigatório")
        Long rotinaId,

        @NotNull(message = "A data da sessão é obrigatória")
        LocalDate dataSessao,

        @Size(max = 500)
        String observacoes,

        @Size(max = 50)
        String status
){ }
