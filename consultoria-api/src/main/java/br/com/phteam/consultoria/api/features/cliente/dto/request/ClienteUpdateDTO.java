package br.com.phteam.consultoria.api.features.cliente.dto.request;

import jakarta.validation.constraints.Positive;

public record ClienteUpdateDTO(
        @Positive(message = "Peso deve ser positivo")
        Double pesoAtual,

        @Positive(message = "Altura deve ser positiva")
        Double altura
){ }
