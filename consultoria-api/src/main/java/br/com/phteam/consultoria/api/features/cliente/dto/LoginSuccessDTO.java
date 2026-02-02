package br.com.phteam.consultoria.api.features.cliente.dto;

public record LoginSuccessDTO(
    String status,
    String email,
    String tipoUsuario
) {
}