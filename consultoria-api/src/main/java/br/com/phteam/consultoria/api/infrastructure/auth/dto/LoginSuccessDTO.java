package br.com.phteam.consultoria.api.infrastructure.auth.dto;

public record LoginSuccessDTO(
    String token,
    String email,
    String tipoUsuario
) {}