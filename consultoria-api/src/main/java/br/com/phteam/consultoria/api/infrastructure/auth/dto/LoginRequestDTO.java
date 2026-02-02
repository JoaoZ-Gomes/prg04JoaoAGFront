package br.com.phteam.consultoria.api.infrastructure.auth.dto;

public record LoginRequestDTO(
    String email,
    String senha
) {
}