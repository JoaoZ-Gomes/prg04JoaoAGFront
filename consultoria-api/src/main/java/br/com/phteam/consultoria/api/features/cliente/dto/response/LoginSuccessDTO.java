package br.com.phteam.consultoria.api.features.cliente.dto.response;

public record LoginSuccessDTO(
    String status,
    String email,
    String tipoUsuario
) {
}