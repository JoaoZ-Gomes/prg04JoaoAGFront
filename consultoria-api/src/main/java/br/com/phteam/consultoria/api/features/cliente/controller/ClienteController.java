package br.com.phteam.consultoria.api.features.cliente.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteRequestDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.request.ClienteUpdateDTO;
import br.com.phteam.consultoria.api.features.cliente.dto.response.ClienteResponseDTO;
import br.com.phteam.consultoria.api.features.cliente.service.ClienteIService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteIService service;
    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);

    // =====================================================
    // POST
    // =====================================================

    /**
     * Cria um novo cliente.
     *
     * @param dto os dados do cliente a ser criado
     * @return ResponseEntity com o cliente criado e status 201
     */
        @PostMapping
        public ResponseEntity<ClienteResponseDTO> criar(
            @RequestBody @Valid ClienteRequestDTO dto,
            HttpServletRequest request) {

        // Temporary logging to debug 403 on deploy (remove after troubleshooting)
        String origin = request.getHeader("Origin");
        String auth = request.getHeader("Authorization");
        logger.info("[TEMP LOG] POST /api/clientes called - Origin: {} - Authorization present: {} - RemoteAddr: {}", origin, (auth != null), request.getRemoteAddr());

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.salvar(dto));
        }

    // =====================================================
    // GET PAGINADO
    // =====================================================

    /**
     * Lista todos os clientes com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return ResponseEntity com página de clientes
     */
    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> listar(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return ResponseEntity.ok(service.buscarTodos(pageable));
    }

    // =====================================================
    // GET POR ID
    // =====================================================

    /**
     * Busca um cliente pelo ID.
     *
     * @param id o identificador do cliente
     * @return ResponseEntity com os dados do cliente
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // =====================================================
    // PUT
    // =====================================================

    /**
     * Atualiza um cliente existente.
     *
     * @param id  o identificador do cliente
     * @param dto os dados para atualização
     * @return ResponseEntity com o cliente atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ClienteUpdateDTO dto) {

        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um cliente pelo ID.
     *
     * @param id o identificador do cliente a ser deletado
     * @return ResponseEntity com status 204
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // MEU PERFIL
    // =====================================================

    /**
     * Obtém o perfil do cliente autenticado.
     *
     * @param auth a autenticação do usuário
     * @return ResponseEntity com os dados do cliente autenticado
     */
    @GetMapping("/meu-perfil")
    public ResponseEntity<ClienteResponseDTO> meuPerfil(Authentication auth) {
        return ResponseEntity.ok(service.buscarPorEmail(auth.getName()));
    }
}
