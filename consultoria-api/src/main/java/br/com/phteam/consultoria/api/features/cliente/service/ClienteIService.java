package br.com.phteam.consultoria.api.features.cliente.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteRequestDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteUpdateDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.response.ClienteResponseDTO;

public interface ClienteIService {

    ClienteResponseDTO salvar(ClienteRequestDTO dto);

    ClienteResponseDTO buscarPorId(Long id);

    Page<ClienteResponseDTO> buscarTodos(Pageable pageable);

    ClienteResponseDTO atualizar(Long id, ClienteUpdateDTO dto);

    void excluirPorId(Long id);

    ClienteResponseDTO buscarPorEmail(String email);
}

