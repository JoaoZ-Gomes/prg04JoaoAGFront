package br.com.phteam.consultoria.api.features.cliente.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClienteRequestDTO(
        @NotBlank(message = "O nome é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String nome,

        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "O formato do email é inválido.")
        String email,

        @NotBlank(message = "A senha é obrigatória.")
        String senha,

        @NotBlank(message = "O CPF é obrigatório.")
        @Size(min = 11, max = 11, message = "O CPF deve ter 11 dígitos (somente números).")
        String cpf,

        @Size(max = 20, message = "O RG pode ter no máximo 20 caracteres.")
        String rg,

        @NotNull(message = "A data de nascimento é obrigatória.")
        LocalDate dataNascimento,

        @Size(max = 20, message = "O telefone pode ter no máximo 20 caracteres.")
        String telefone
){ }