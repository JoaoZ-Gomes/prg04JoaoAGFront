package br.com.phteam.consultoria.api.features.sessao.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoCriarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.response.SessaoResponseDTO;
import br.com.phteam.consultoria.api.features.sessao.service.SessaoIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sessoes")
@RequiredArgsConstructor
public class SessaoController {

    private final SessaoIService service;

    // =====================================================
    // POST
    // =====================================================

    /**
     * Cria uma nova sessão de treinamento.
     *
     * @param dto os dados da sessão a ser criada
     * @return ResponseEntity com a sessão criada e status 201
     */
    @PostMapping
    public ResponseEntity<SessaoResponseDTO> criar(@RequestBody @Valid SessaoCriarRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    // =====================================================
    // GET PAGINADO
    // =====================================================

    /**
     * Lista todas as sessões com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return ResponseEntity com página de sessões
     */
    @GetMapping
    public ResponseEntity<Page<SessaoResponseDTO>> listar(@PageableDefault(size = 10, sort = "dataSessao") Pageable pageable) {
        return ResponseEntity.ok(service.findAllPaged(pageable));
    }

    // =====================================================
    // GET TODOS SEM PAGINAÇÃO
    // =====================================================

    /**
     * Lista todas as sessões sem paginação.
     *
     * @return ResponseEntity com lista de todas as sessões
     */
    @GetMapping("/all")
    public ResponseEntity<List<SessaoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.findAll());
    }

    // =====================================================
    // GET POR ID
    // =====================================================

    /**
     * Busca uma sessão pelo ID.
     *
     * @param id o identificador da sessão
     * @return ResponseEntity com os dados da sessão
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessaoResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // =====================================================
    // GET POR ROTINA
    // =====================================================

    /**
     * Lista todas as sessões de uma rotina.
     *
     * @param rotinaId o identificador da rotina
     * @return ResponseEntity com lista de sessões da rotina
     */
    @GetMapping("/rotina/{rotinaId}")
    public ResponseEntity<List<SessaoResponseDTO>> buscarPorRotina(@PathVariable Long rotinaId) {
        return ResponseEntity.ok(service.findByRotinaId(rotinaId));
    }

    // =====================================================
    // PUT
    // =====================================================

    /**
     * Atualiza uma sessão existente.
     *
     * @param id  o identificador da sessão
     * @param dto os dados para atualização
     * @return ResponseEntity com a sessão atualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<SessaoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid SessaoAtualizarRequestDTO dto) {
        SessaoAtualizarRequestDTO withId = new SessaoAtualizarRequestDTO(id, dto.dataSessao(), dto.observacoes(), dto.status());
        return ResponseEntity.ok(service.update(withId));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta uma sessão pelo ID.
     *
     * @param id o identificador da sessão a ser deletada
     * @return ResponseEntity com status 204
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
