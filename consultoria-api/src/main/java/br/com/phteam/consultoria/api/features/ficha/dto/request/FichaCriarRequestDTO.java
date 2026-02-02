package br.com.phteam.consultoria.api.features.ficha.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FichaCriarRequestDTO(

        @NotBlank(message = "O nome da ficha é obrigatório")
        @Size(max = 100)
        String nome,

        @Size(max = 500)
        String objetivo,

        @NotNull(message = "O id do cliente é obrigatório")
        Long clienteId
)
{}
