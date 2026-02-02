package br.com.phteam.consultoria.api.features.cliente.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteRequestDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteUpdateDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.response.ClienteResponseDTO;
import br.com.phteam.consultoria.api.features.cliente.mapper.ClienteMapper;
import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import br.com.phteam.consultoria.api.features.cliente.repository.ClienteRepository;
import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;
import br.com.phteam.consultoria.api.infrastructure.exception.RegraDeNegocioException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService implements ClienteIService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;
    private final PasswordEncoder passwordEncoder;

    // =====================================================
    // CREATE
    // =====================================================

    /**
     * Salva um novo cliente após validações.
     *
     * @param dto os dados do cliente a ser salvo
     * @return ClienteResponseDTO com o cliente salvo
     * @throws RegraDeNegocioException se o email já está cadastrado
     */
    @Override
    public ClienteResponseDTO salvar(ClienteRequestDTO dto) {

        if (repository.findByEmail(dto.email()).isPresent()) {
            throw new RegraDeNegocioException("E-mail já cadastrado.");
        }

        Cliente cliente = mapper.toEntity(dto);
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));

        return mapper.toResponseDTO(repository.save(cliente));
    }

    // =====================================================
    // READ
    // =====================================================

    /**
     * Busca um cliente pelo ID.
     *
     * @param id o identificador do cliente
     * @return ClienteResponseDTO com os dados do cliente
     * @throws RecursoNaoEncontradoException se o cliente não existe
     */
    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado: " + id));
        return mapper.toResponseDTO(cliente);
    }

    /**
     * Lista todos os clientes com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return Page contendo clientes encontrados
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ClienteResponseDTO> buscarTodos(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }

    /**
     * Busca um cliente pelo email.
     *
     * @param email o email do cliente
     * @return ClienteResponseDTO com os dados do cliente
     * @throws RecursoNaoEncontradoException se o cliente não existe
     */
    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorEmail(String email) {
        Cliente cliente = repository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado para email: " + email));
        return mapper.toResponseDTO(cliente);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    /**
     * Atualiza um cliente existente.
     *
     * @param id  o identificador do cliente
     * @param dto os dados para atualização
     * @return ClienteResponseDTO com o cliente atualizado
     * @throws RecursoNaoEncontradoException se o cliente não existe
     */
    @Override
    public ClienteResponseDTO atualizar(Long id, ClienteUpdateDTO dto) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado: " + id));

        mapper.updateEntityFromDTO(dto, cliente);

        return mapper.toResponseDTO(repository.save(cliente));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um cliente pelo ID.
     *
     * @param id o identificador do cliente a ser deletado
     * @throws RecursoNaoEncontradoException se o cliente não existe
     */
    @Override
    public void excluirPorId(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Cliente não encontrado: " + id);
        }
        repository.deleteById(id);
    }
}
