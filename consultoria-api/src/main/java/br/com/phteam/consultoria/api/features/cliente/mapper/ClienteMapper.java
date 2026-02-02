package br.com.phteam.consultoria.api.features.cliente.mapper;

import org.springframework.stereotype.Component;

import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteRequestDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteUpdateDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.response.ClienteResponseDTO;
import br.com.phteam.consultoria.api.features.cliente.model.Cliente;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(dto.senha());
        cliente.setCpf(dto.cpf());
        cliente.setRg(dto.rg());
        cliente.setDataNascimento(dto.dataNascimento());
        cliente.setTelefone(dto.telefone());
        return cliente;
    }

    public ClienteResponseDTO toResponseDTO(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getCpf(),
                cliente.getRg(),
                cliente.getDataNascimento(),
                cliente.getTelefone(),
                cliente.getPesoAtual(),
                cliente.getAltura()
        );
    }

    public void updateEntityFromDTO(ClienteUpdateDTO dto, Cliente cliente) {
        if (dto.pesoAtual() != null) cliente.setPesoAtual(dto.pesoAtual());
        if (dto.altura() != null) cliente.setAltura(dto.altura());
    }
}


