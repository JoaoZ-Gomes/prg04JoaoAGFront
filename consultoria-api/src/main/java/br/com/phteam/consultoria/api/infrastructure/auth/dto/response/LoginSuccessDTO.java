package br.com.phteam.consultoria.api.infrastructure.auth.dto.response;

public record LoginSuccessDTO(
    String token,
    String email,
    String tipoUsuario
) {}