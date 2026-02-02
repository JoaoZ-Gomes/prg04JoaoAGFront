package br.com.phteam.consultoria.api.features.consultor.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConsultorRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome não deve exceder 100 caracteres")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
        String senha,

        String telefone,

        @NotBlank(message = "O CREF é obrigatório")
        @Size(max = 15, message = "O CREF não deve exceder 15 caracteres")
        String numeroCref,

        @Size(max = 50, message = "A especialização não deve exceder 50 caracteres")
        String especializacao
){ }