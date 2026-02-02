package br.com.phteam.consultoria.api.infrastructure.auth.dto.request;

public record LoginRequestDTO(
    String email,
    String senha
) {
}