package br.com.phteam.consultoria.api.infrastructure.auth.dto.response;

public record LoginResponseDTO(
    String token,
    String email,
    String tipoUsuario
) {
}