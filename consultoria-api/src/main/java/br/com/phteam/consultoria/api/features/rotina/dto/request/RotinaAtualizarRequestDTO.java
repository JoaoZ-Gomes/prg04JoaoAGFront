package br.com.phteam.consultoria.api.features.rotina.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RotinaAtualizarRequestDTO(
        @NotNull(message = "O ID é obrigatório") Long id,
        Long fichaId,
        Long exercicioId,
        Integer series,
        Integer repeticoes,
        @Size(max = 100) String nome
){ }
