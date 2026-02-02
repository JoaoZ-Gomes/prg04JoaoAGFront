package br.com.phteam.consultoria.api.features.consultor.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import br.com.phteam.consultoria.api.features.consultor.dto.request.ConsultorRequestDTO;
import br.com.phteam.consultoria.api.features.consultor.dto.response.ConsultorResponseDTO;
import br.com.phteam.consultoria.api.features.consultor.model.Consultor;
import br.com.phteam.consultoria.api.features.consultor.service.ConsultorService;
import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;
import br.com.phteam.consultoria.api.infrastructure.mapper.ObjectMapperUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/consultores")
@RequiredArgsConstructor
public class ConsultorController {

    private final ConsultorService consultorService;
    private final ObjectMapperUtil mapper;

    // =====================================================
    // POST
    // =====================================================

    /**
     * Cria um novo consultor.
     *
     * @param consultorRequest os dados do consultor a ser criado
     * @return ResponseEntity com o consultor criado e status 201
     */
    @PostMapping
    public ResponseEntity<ConsultorResponseDTO> criarConsultor(
            @RequestBody @Valid ConsultorRequestDTO consultorRequest) {

        Consultor consultor = mapper.map(consultorRequest, Consultor.class);
        Consultor salvo = consultorService.salvar(consultor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.map(salvo, ConsultorResponseDTO.class));
    }

    // =====================================================
    // GET PAGINADO
    // =====================================================

    /**
     * Lista todos os consultores com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return ResponseEntity com página de consultores
     */
    @GetMapping
    public ResponseEntity<Page<ConsultorResponseDTO>> buscarTodos(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        Page<ConsultorResponseDTO> response = consultorService.buscarTodos(pageable)
                .map(consultor -> mapper.map(consultor, ConsultorResponseDTO.class));

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // GET POR ID
    // =====================================================

    /**
     * Busca um consultor pelo ID.
     *
     * @param id o identificador do consultor
     * @return ResponseEntity com os dados do consultor
     * @throws RecursoNaoEncontradoException se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConsultorResponseDTO> buscarPorId(@PathVariable Long id) {

        Consultor consultor = consultorService.buscarPorId(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException("Consultor não encontrado com ID: " + id));

        return ResponseEntity.ok(mapper.map(consultor, ConsultorResponseDTO.class));
    }

    // =====================================================
    // MEUS CLIENTES
    // =====================================================

    /**
     * Lista todos os clientes do consultor autenticado.
     *
     * @param authentication a autenticação do usuário
     * @return ResponseEntity com lista de clientes do consultor
     * @throws RecursoNaoEncontradoException se não encontrado
     */
    @GetMapping("/meus-clientes")
    @PreAuthorize("hasRole('CONSULTOR')")
    public ResponseEntity<List<Cliente>> buscarMeusClientes(Authentication authentication) {

        String emailConsultor = authentication.getName();

        Consultor consultor = consultorService.buscarPorEmail(emailConsultor)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Consultor não encontrado com email: " + emailConsultor
                        )
                );

        List<Cliente> clientes = consultorService.buscarClientesDoConsultorPorId(consultor.getId());

        return ResponseEntity.ok(clientes);
    }

    // =====================================================
    // PUT
    // =====================================================

    /**
     * Atualiza um consultor existente.
     *
     * @param id      o identificador do consultor
     * @param request os dados para atualização
     * @return ResponseEntity com o consultor atualizado
     * @throws RecursoNaoEncontradoException se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ConsultorResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ConsultorRequestDTO request) {

        Consultor dadosAtualizados = mapper.map(request, Consultor.class);

        Consultor atualizado = consultorService.atualizar(id, dadosAtualizados)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException("Consultor não encontrado com ID: " + id));

        return ResponseEntity.ok(mapper.map(atualizado, ConsultorResponseDTO.class));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um consultor pelo ID.
     *
     * @param id o identificador do consultor a ser deletado
     * @return ResponseEntity com status 204
     * @throws RecursoNaoEncontradoException se não encontrado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        consultorService.deletarConsultor(id);
        return ResponseEntity.noContent().build();
    }
}
