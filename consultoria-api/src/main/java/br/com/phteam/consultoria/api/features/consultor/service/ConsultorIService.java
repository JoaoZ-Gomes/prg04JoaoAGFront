package br.com.phteam.consultoria.api.features.consultor.service;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import br.com.phteam.consultoria.api.features.consultor.model.Consultor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ConsultorIService {

    // CREATE
    Consultor salvar(Consultor consultor);

    // READ
    Page<Consultor> buscarTodos(Pageable pageable);

    Optional<Consultor> buscarPorId(Long id);

    Optional<Consultor> buscarPorEmail(String email);

    // DASHBOARD
    List<Cliente> buscarClientesDoConsultorPorId(Long consultorId);

    List<Cliente> buscarClientesDoConsultor(String email);

    // UPDATE
    Optional<Consultor> atualizar(Long id, Consultor dadosAtualizados);

    // DELETE
    void deletarConsultor(Long id);
}
